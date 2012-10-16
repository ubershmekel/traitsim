import ast
from collections import Counter
import pprint
import time
import random
import math

import matplotlib.pyplot as plt
import numpy as np

from simulate import *

def dark(r, d):
    """
    r - amount of the gene pool with the recessive gene
    d - amount of the gene pool with the dominant gene
    
    returns the percentage of the population with the dominant trait
    """
    return d * 1.0 / (r + d) + d * r * 1.0 / ((r + d) ** 2)


def graph_expression():
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


def graph_pops():
    text = open(OUTPUT_FNAME).read()
    results = ast.literal_eval(text)
    xs = []
    ys = []
    for key, gene_pool in results.items():
        xs.append(key)
        ys.append(gene_pool.count(BROWN) * 1.0 / len(gene_pool))
    #pairs = sorted(results.items())
    ax = plt.subplot(111)
    #xs, ys = zip(*pairs)
    ax.plot(xs, np.array(xs) * 1.0 / max(xs), label='expected', linewidth=3, c='#777777', linestyle='dashed')
    ax.plot(xs, ys, label='simulated', linewidth=1, c='#2299ff')
    plt.ylabel('probability of the other gene going extinct')
    plt.xlabel('Initial % of gene pool')
    plt.legend(loc=2)
    plt.show()

if __name__ == "__main__":
    #graph_expression()
    graph_pops()
