import romkan

def search_words(input, dictionary):
    if not input:
        return []

    search_term = input.strip().lower()
    kana_search_term = romkan.to_kana(search_term)

    results = []

    for entry in dictionary:
        # Kanji search
        kanji_match = any(kanji.find(search_term) != -1 for kanji in entry.kanji)
        if kanji_match:
            results.append(entry)
            continue

        # Kana search
        kana_match = any(kana.find(kana_search_term) != -1 for kana in entry.kana)
        if kana_match:
            results.append(entry)
            continue

        # Romaji search
        romaji_match = any(kana.find(romkan.to_kana(search_term)) != -1 for kana in entry.kana)
        if romaji_match:
            results.append(entry)
            continue

        # Meaning search
        meaning_match = any(meaning.lower().find(search_term) != -1 for meaning in entry.meanings)
        if meaning_match:
            results.append(entry)
            continue

    return results
