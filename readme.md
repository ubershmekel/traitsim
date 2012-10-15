﻿TraitSim
============

This simulation is a toy to help explore and understand random trait and gene proliferation.

There are common misconceptions in the biology classroom about [recessive traits](http://en.wikipedia.org/wiki/Recessive).

Myths:

* Recessive traits are more likely to go extinct.
* Dominant traits are more likely to grow in numbers with each generation.
* It'd be surprising to find a recessive gene in a majority over a dominant gene (e.g. O blood type is recessive and the majority).

Truths:

* In completely random procreation, the recessive and dominant traits are equally likely to go extinct.
* If both gene counts are even, dominant traits are likely to be expressed in 75% of the population.

Calculations:
* D - the percentage of the gene pool with the dominant trait. R the percentage of the recessive gene.
* Dominant genes are likely to be expressed = D + D * R
* Recessive genes are likely to be expressed = R²

![graph for recessive vs dominant gene demographics](http://i.imgur.com/Z4LM4.png "This only refers to gene expression, not to be confused with chance of extinction.")

TraitSim Explained
========================

People are illustrated as a pair of dots. One colored dot per gene. If the
brown eyed gene is present it will appear in front of the blue eyed gene.

Each "sex" generation causes the entire population to randomly pair up and
make 2 children. The results are visible in the bar graphs at the bottom left.
Note that when 2 parents mate, each gene from the parent is equally likely
to be inherited.

After leaving the "sex party" on for enough time, most likely one of the gene types
will become extinct. The gene type with the lower current gene count is more likely to
decrease further. During a tie with 50% blue vs 50% brown genes,
there are likely to be 25% with blue eyes and 75% with brown eyes.

Note that [eye color](http://en.wikipedia.org/wiki/Eye_color) isn't really determined by one or two
genes.

Animated and drawn with the [Paper.js](http://paperjs.org) framework.

Live demo at http://yuvalg.com/traitsim/