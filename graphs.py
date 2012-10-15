import matplotlib.pyplot as plt
import numpy as np

def dark(r, d):
    """
    r - amount of the gene pool with the recessive gene
    d - amount of the gene pool with the dominant gene
    
    returns the percentage of the population with the dominant trait
    """
    return d * 1.0 / (r + d) + d * r * 1.0 / ((r + d) ** 2)

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
