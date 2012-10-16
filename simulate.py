import pprint
import random
import time



BROWN = 0
BLUE = 1

class Pop:
    def __init__(self, pop_size=100, dominant_percent=0.5):
        # imagine that self.genes[:2] is a person
        #self.genes = [BROWN, BLUE] * pop_size
        dominant_count = int(2 * pop_size * dominant_percent)
        rec_count = 2 * pop_size - dominant_count
        self.genes = [BROWN] * dominant_count + [BLUE] * rec_count
        #print(Counter(self.genes))
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
        
        return self.genes[0]
        

TESTS = 500
OUTPUT_FNAME = 'results.txt'

def main():
    global death_gens
    death_gens = []
    
    start_time = time.time()
    results = {}
    for start in range(100):
        win_log = []
        print start,
        for i in xrange(TESTS):
            #print i,
            p = Pop(100, start / 100.0)
            survived = p.until_extinct()
            win_log.append(survived)
            death_gens.append(p.generations)
        results[start] = win_log
    
        #print 'ran %d tests' % TESTS
        #print 'min', min(death_gens)
        #print 'max', max(death_gens)
        #print 'avg', np.mean(death_gens)
        #print 'stddev', np.std(death_gens)
        #print 'median', np.median(death_gens)
        #plt.hist(death_gens, bins=TESTS / 10)
        #plt.show()

    print 'after %g minutes' % ( (time.time() - start_time) / 60.0)

    open(OUTPUT_FNAME, 'w').write(pprint.pformat(results))

if __name__ == "__main__":
    main()

