import { InputError } from './error';

export function mean(values: number[]): number {
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

function find_diffs(vals: number[]) {
    const diffs: number[] = [];
    for (let i = 0; i < vals.length - 1; i++) {
        diffs.push(vals[i+1]-vals[i]);
    }
    return diffs;
}

function all_equal(vals: number[]): boolean {
    for (let i = 0; i < vals.length; i++) {
        if (vals[i] !== vals[0]) {
            return false;
        }
    }
    return true
}

function exp_arr(mult: number, length: number): number[] {
    const ret: number[] = [];
    for (let i = 0; i < length; i++) {
        ret.push(mult * i * i);
    }
    return ret;
}

export function linear_nth_term(vals: number[]): string {
    const diffs = find_diffs(vals);
    if (!all_equal(diffs)) {
        throw new InputError('Input to linear_nth_term must be a linear sequence!');
    }
    const diff = diffs[0];
    const offset = vals[0] - diff;

    let s;
    if (diff !== 1) {
        s = 'n';
    } else {
        s = `${diff}n`;
    }

    if (offset !== 0) {
        return `${s} + ${offset}`;
    } else {
        return s;
    }
}

export function quadratic_nth_term(vals: number[]): string {
    if (vals.length < 3) {
        throw new InputError('Input to quadratic_nth_term must have at least 3 values');
    }

    const first_diffs = find_diffs(vals);
    const second_diffs = find_diffs(first_diffs);

    if (!all_equal(second_diffs)) {
        throw new InputError('Input is not a quadratic sequence');
    }

    const mult = second_diffs[0] / 2;
    const sqs = exp_arr(mult, vals.length);

    const linear: number[] = [];
    for (let i = 0; i < vals.length; i++) {
        linear.push(vals[i] - sqs[i]);
    }
    let s;
    if (mult !== 1) {
        s = `${mult}n^2`;
    } else {
        s = 'n^2'
    }

    if (linear.every(v => v === 0)) {
        return s;
    } else {
        return `${s} + ${linear_nth_term(linear)}`;
    }
}

export function infered_nth_term(vals: number[]): string {
    const diffs = find_diffs(vals);
    if (all_equal(diffs)) {
        return linear_nth_term(vals);
    } else {
        return quadratic_nth_term(vals);
    }
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

export function hcf(a: number, b: number): number {
    if (a <= 0 || b <= 0) {
        throw new InputError('Inputs must not be negative');
    }

    // short circuits
    if (a === b) { // equal - the lcm is always the value
        return a;
    }
    if (a % b === 0) { // a is divisible by b, so b is the maximum HCF
        return b;
    }
    if (b % a === 0) { // b is divisible by a, so a is the maximum HCF
        return a;
    }

    const a_factors = prime_factors(a);
    const b_factors = prime_factors(b);

    // More short circuits
    if (a_factors.length === 0 || b_factors.length === 0) {
        // One of the values is prime, and the other is NOT divisible by it, so the HCF must be 1
        return 1;
    }

    const a_factors2 = a_factors.slice();
    const common_factors: number[] = [];
    for (let i = 0; i < a_factors.length; i++) {
        const fact = a_factors[i];
        if (b_factors.includes(fact)) {
            b_factors.splice(b_factors.indexOf(fact), 1);
            a_factors2.splice(a_factors2.indexOf(fact), 1);
            common_factors.push(fact);
        }
    }

    for (let i = 0; i < b_factors.length; i++) {
        const fact = b_factors[i];
        if (a_factors2.includes(fact)) {
            common_factors.push(fact);
            a_factors2.splice(a_factors2.indexOf(fact), 1);
        }
    }

    return common_factors.reduce((a, b) => a * b);
}
