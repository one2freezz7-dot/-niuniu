export function getValidIdSet(items) {
  return new Set(items.map((item) => item.id));
}

/**
 * 将 localStorage 中的收藏整理为「有效、去重、保持抽取顺序」的 id 列表。
 * 损坏或过期的数据不会让页面崩溃。
 */
export function normalizeCollection(value, validIds) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  const result = [];

  for (const id of value) {
    if (typeof id !== "string") continue;
    if (!validIds.has(id) || seen.has(id)) continue;
    seen.add(id);
    result.push(id);
  }

  return result;
}

export function loadCollection(storageKey, items) {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const collection = parsed?.collection;
    return normalizeCollection(collection, getValidIdSet(items));
  } catch {
    return [];
  }
}

export function saveCollection(storageKey, collection) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({ version: 1, collection }),
    );
  } catch {
    // 隐私模式或存储空间不足时，页面仍然可以正常使用，只是刷新后不保留记录。
  }
}

/**
 * 只从尚未抽取的对象池里选择一条。
 * 返回的 item 同时携带 photo / title / text，避免照片和文字来自不同随机结果。
 */
export function pickRandomAvailable(items, collectionIds, random = Math.random) {
  const collected = new Set(collectionIds);
  const available = items.filter((item) => !collected.has(item.id));
  if (available.length === 0) return null;

  const rawIndex = Math.floor(random() * available.length);
  const index = Math.max(0, Math.min(rawIndex, available.length - 1));
  return available[index];
}
