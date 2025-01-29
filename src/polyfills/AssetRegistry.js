// Simple polyfill for AssetRegistry
const assets = new Map();

export function registerAsset(asset) {
  if (!asset) return null;
  assets.set(asset.id, asset);
  return asset.id;
}

export function getAssetByID(assetId) {
  return assets.get(assetId) || null;
}

export function unregisterAsset(assetId) {
  assets.delete(assetId);
}

export default {
  registerAsset,
  getAssetByID,
  unregisterAsset,
  assets
};
