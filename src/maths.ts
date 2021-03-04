function mean(values: number[]): number {
    const sum = values.reduce((a, b) => a + b);
    return sum / values.length;
}

function is_prime(n: number): boolean {
    for (let i = 2; i < n; i++) {
        if (n % i == 0) {
            return false;
        }
    }
    return true;
}

function find_all_primes(to: number): number[] {
    const primes: number[] = []

    for (let i = 2; i < to; i++) {
        if (is_prime(i)) {
            primes.push(i);
        }
    }

    return primes;
}

export function prime_factors(val: number): number[] {
    if (is_prime(val)) {
        return [val];
    }
    const primes = find_all_primes(val);
    for (let i = 0; i < primes.length; i++) {
        if (val % primes[i] == 0) {
            const factors = prime_factors(val / primes[i])
            factors.push(primes[i]);
            factors.sort((a, b) => a - b);
            return factors;
        }
    }
    return []; // This should never happen.
}
