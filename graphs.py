import time
import random
import math

import matplotlib.pyplot as plt
import numpy as np

def dark(r, d):
    """
    r - amount of the gene pool with the recessive gene
    d - amount of the gene pool with the dominant gene
    
    returns the percentage of the population with the dominant trait
    """
    return d * 1.0 / (r + d) + d * r * 1.0 / ((r + d) ** 2)


def show_expression():
    xs = range(0,101)
    ys = [100 * dark(100 - i, i) for i in xs]
    ax = plt.subplot(111)
    ax.plot(xs, ys, label='dominant gene', linewidth=3, c='#652f16')

    ys = [100 * (1 - dark(i, 100 - i)) for i in xs]
    ax = plt.subplot(111)
    ax.plot(xs, ys, label='recessive gene', linewidth=3, c='#2299ff')

    plt.ylabel('expected % of people with trait')
    plt.xlabel('% of gene pool')
    plt.legend(loc=2)

    plt.show()

BROWN = 0
BLUE = 1

class Pop:
    def __init__(self, pop_size=50):
        # imagine that self.genes[:2] is a person
        self.genes = [BROWN, BLUE] * pop_size
        random.shuffle(self.genes)
        self.generations = 0
    
    def generation(self):
        new_genes = []
        for i in xrange(len(self.genes) // 4):
            mate1 = [self.genes.pop(), self.genes.pop()]
            mate2_index = random.randint(0, (len(self.genes) - 2) / 2)
            mate2 = self.genes.pop(mate2_index * 2), self.genes.pop(mate2_index * 2)
            
            new_genes.append(random.choice(mate1))
            new_genes.append(random.choice(mate2))
            
            new_genes.append(random.choice(mate1))
            new_genes.append(random.choice(mate2))
            
        self.genes = new_genes
        self.generations += 1
    
    def until_extinct(self):
        while (BLUE in self.genes) and (BROWN in self.genes):
            self.generation()
        

TESTS = 1000

def main():
    global death_gens
    death_gens = []
    
    start = time.time()
    for i in xrange(TESTS):
        print i,
        p = Pop()
        p.until_extinct()
        death_gens.append(p.generations)
    
    print 'after %g minutes' % ( (time.time() - start) / 60.0)
    print 'ran %d tests' % TESTS
    print 'min', min(death_gens)
    print 'max', max(death_gens)
    print 'avg', np.mean(death_gens)
    print 'stddev', np.std(death_gens)
    print 'median', np.median(death_gens)
    plt.hist(death_gens, bins=TESTS / 10)
    plt.show()


if __name__ == "__main__":
    main()
