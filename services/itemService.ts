// services/itemService.ts
export type PokemonItem = {
  name: string;
  url: string;
  description: string;
  sprite: string;
};

// Lista de categorias mais precisa e focada em itens que um Pokémon pode segurar
const relevantItemCategories = [
  'held-items',    // Itens gerais (Leftovers, Life Orb)
  'choice',        // Itens Choice (Band, Scarf, Specs)
  'scarves',       // Cachecóis (embora geralmente em held-items, é bom garantir)
  'mega-stones',   // Mega Stones (para futuras gerações)
  'plates',        // Plates do Arceus
  'vitamins',      // Itens que aumentam stats (HP Up, Protein)
  'healing',       // Itens de cura (Potions, Berries)
  'stat-boosts',   // Itens de batalha (X Attack, etc.)
];

export async function fetchAllItems(): Promise<PokemonItem[]> {
  try {
    const categoryPromises = relevantItemCategories.map(category =>
      fetch(`https://pokeapi.co/api/v2/item-category/${category}`).then(res => {
        if (!res.ok) return null; // Se a categoria não for encontrada, retorna nulo
        return res.json();
      })
    );

    // Promise.allSettled é mais seguro, ele não falha se uma das promessas for rejeitada.
    const results = await Promise.allSettled(categoryPromises);

    const successfulCategories = results
      .filter(result => result.status === 'fulfilled' && result.value)
      .map(result => (result as PromiseFulfilledResult<any>).value);

    const allItemUrls = successfulCategories.flatMap(category => category.items.map((item: any) => item.url));
    const uniqueItemUrls = [...new Set(allItemUrls)];

    const itemDetailPromises = uniqueItemUrls.map(url => fetch(url).then(res => res.json()));
    const itemsData = await Promise.all(itemDetailPromises);

    const formattedItems: PokemonItem[] = itemsData.map(item => {
      const descriptionEntry = item.flavor_text_entries.find(
        (entry: any) => entry.language.name === 'en'
      );
      return {
        name: item.name.replace(/-/g, ' '), // Formata o nome para ser mais legível
        url: `https://pokeapi.co/api/v2/item/${item.id}/`,
        description: descriptionEntry?.text.replace(/\s+/g, ' ') || 'Sem descrição.',
        sprite: item.sprites.default,
      };
    });

    formattedItems.sort((a, b) => a.name.localeCompare(b.name));
    return formattedItems;
  } catch (error) {
    console.error("Erro ao buscar itens:", error);
    return [];
  }
}