import { StorageClient } from "@/utils/StorageClient";
import { HttpAgent } from "@icp-sdk/core/agent";
import { useCallback } from "react";
import { loadConfig } from "../config";

let clientCache: StorageClient | null = null;

async function getStorageClient(): Promise<StorageClient> {
  if (clientCache) return clientCache;
  const config = await loadConfig();
  const agent = new HttpAgent({ host: config.backend_host });
  if (config.backend_host?.includes("localhost")) {
    await agent.fetchRootKey().catch(() => {});
  }
  clientCache = new StorageClient(
    config.bucket_name,
    config.storage_gateway_url,
    config.backend_canister_id,
    config.project_id,
    agent,
  );
  return clientCache;
}

export function useStorageClient() {
  const uploadFile = useCallback(async (file: File): Promise<string> => {
    const client = await getStorageClient();
    const bytes = new Uint8Array(await file.arrayBuffer());
    const { hash } = await client.putFile(bytes);
    return hash;
  }, []);

  const getFileUrl = useCallback(async (hash: string): Promise<string> => {
    const client = await getStorageClient();
    return client.getDirectURL(hash);
  }, []);

  return { uploadFile, getFileUrl };
}
