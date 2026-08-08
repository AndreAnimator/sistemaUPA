export class RiskPatternMatcher {
    static matchRiskLevel(sintomas: string[], idade: number): string{
        const patterns = [
            {
                pattern: (s: string[]) => s.some(sint =>
                    ['parada cardíaca', 'hemorragia', 'convulsão'].includes(sint.toLowerCase())
                ),
                result: 'emergencia'
            },
            {
                pattern: (s: string[]) => s.some(sint =>
                    ['dor intensa', 'fratura exposta'].includes(sint.toLowerCase())
                ),
                result: 'muito-urgente'
            },
            {
                pattern: (s: string[]) => s.some(sint =>
                    ['febre alta', 'vômito persistente'].includes(sint.toLowerCase())
                ),
                result: 'urgente'
            },
            {
                pattern: (s: string[], i: number) => i > 65,
                result: 'pouco-urgente'
            }
        ];

        for (const { pattern, result } of patterns){
            if (pattern(sintomas, idade)) {
                return result;
            }
        }

        return 'nao-urgente';
    }
}