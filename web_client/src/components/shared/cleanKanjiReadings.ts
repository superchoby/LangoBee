export const cleanKanjiReadings = (readings: string[]) => {
    const readingSet = new Set<string>()
    for (const reading of readings) {
      let modifiedReading = reading
      const dotIdx = modifiedReading.indexOf('.')
      if (dotIdx !== -1) {
        modifiedReading = modifiedReading.slice(0, dotIdx)
      }
      readingSet.add(modifiedReading.replace('-', ''))
    }
    return Array.from(readingSet)
}