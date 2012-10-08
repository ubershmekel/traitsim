// NOTE: the toString is important so I can use these as
// values of associative arrays. Oh how I miss dict().

var BLUE = {
    name: 'blue',
    color: '#29f',
    isDominant: false,
    toString: function() { return this.name }
    };
var BROWN = {
    name: 'brown',
    color: '#930',
    isDominant: true,
    toString: function() { return this.name }
    };

var GENE_HEIGHT = 10;
var GENE_WIDTH = 20;
var GENE_SPACING = 5;
var MARGIN = view.size.width / 10;
var initAmount = 100;

function shuffle(list) {
//shuffles list in-place
    var i, j, t;
    for (i = 1; i < list.length; i++) {
        // choose j in [0..i]
        j = Math.floor(Math.random() * (1 + i));
        if (j != i) {
            // swap list[i] and list[j]
            t = list[i];
            list[i] = list[j];
            list[j] = t;
        }
    }
}

function dominanceSort(gene_a, gene_b) {
    return gene_a.isDominant;
}

function initGene(gene, pos) {
    var path = new Path();
    path.add(pos);
    path.add(pos + [0, GENE_HEIGHT]);
    //var path = new Path.Rectangle(rects[i]);
    path.style = {
        strokeColor: gene.color,
        strokeWidth: GENE_WIDTH,
        strokeCap: 'round'
    };
    return path;
}

function initPerson(genes, pos) {
    var paths = []
    if(genes.length == 0) {
        throw "Bad person with no genes";
    }
    
    genes.sort(dominanceSort);
    
    for(var i = 0; i < genes.length; i++) {
        paths[i] = initGene(genes[i], pos + [i * GENE_SPACING, 0]);
    }
    
    var group = new Group(paths);
    var person = {
                    genes: genes,
                    path: group
                    }    
    return person
}

function randomSpot() {
    var width = view.size.width;
    var height = view.size.height;
    return Point.random() * [width - 2 * MARGIN, height - 2 * MARGIN] + [MARGIN, MARGIN]
}

// init gene pool
var genePool = []
for (var i = 0; i < initAmount; i++) {
    genePool.push(BLUE);
    genePool.push(BROWN);
}
shuffle(genePool);

function initPeople() {
    people = []
    for (var i = 0; i < initAmount; i++) {
        var genes = [genePool.shift(), genePool.shift()];
        var pos = randomSpot()
        people[i] = initPerson(genes, pos)
    }
    return people;
}

function initTitles() {
    messages = [
        "TraitSim",
        "Simulate recessive and dominant gene demographics",
        "Click anywhere for random sex",
        "Press 'c' for a crazy sex party"
        ]
    for(var i = 0; i < messages.length; i++) {
        var text = new PointText([view.size.width / 2, 25 + i * 25]);
        text.justification = 'center';
        text.fillColor = 'white';
        text.content = messages[i];
        text.fontSize = 15;
    }
}

function countState() {
    var geneCount = {}
    geneCount[BLUE] = 0
    geneCount[BROWN] = 0

    var traitCount = {}
    traitCount[BLUE] = 0
    traitCount[BROWN] = 0
    
    for (var i = 0; i < people.length; i++) {
        var genes = people[i].genes
        var selectedTrait = BLUE;
        for (var j = 0; j < genes.length; j++) {
            geneCount[genes[j]] += 1
            if(genes[j].isDominant) {
                selectedTrait = genes[j];
            }
        }
        traitCount[selectedTrait] += 1
    }
    
    return {
        trait: traitCount,
        gene: geneCount
        };
}

var barMaxWidth = 200;
var barMaxThickness = 20
var barTextRelief = 5
function graphText(pos, str) {
    var text = new PointText(pos);
    text.fontSize = 10
    text.fillColor = 'white'
    text.content = str
    return text
}

function initGraph(pos, amount, label, color) {
    var rightX = barMaxWidth * amount / 100;
    path = new Path.Rectangle(pos, new Size(rightX, barMaxThickness))
    path.style = {
        fillColor: color,
        //strokeWidth: GENE_WIDTH,
        //strokeCap: 'round'
    };
    var text = graphText(pos + [rightX + 5, barMaxThickness - barTextRelief], label)
    return {
        path: path,
        text: text,
        pos: pos,
        amount: amount,
        label: label
    };
}

var graphs = {}
function initAllGraphs() {
    graphs.gene = {}
    var graphsPoint = new Point(10, view.size.height)
    graphs.gene[BLUE] = initGraph(graphsPoint - [0, barMaxThickness * 1.5], 50, 'blue genes', BLUE.color)
    graphs.gene[BROWN] = initGraph(graphsPoint - [0, barMaxThickness * 3], 50, 'brown genes', BROWN.color)
    graphs.trait = {}
    graphs.trait[BLUE] = initGraph(graphsPoint - [0, barMaxThickness * 4.5], 50, 'blue eyes', BLUE.color)
    graphs.trait[BROWN] = initGraph(graphsPoint - [0, barMaxThickness * 6], 50, 'brown eyes', BROWN.color)
    graphs.generation = graphText(graphsPoint - [0, barMaxThickness * 7.5 + - barTextRelief], '')
}

function updateGraph(graph, amount) {
    var baseX = graph.path.segments[0].point.x
    var barEdgeX = baseX + barMaxWidth * amount / 100;
    graph.path.segments[2].point.x = barEdgeX;
    graph.path.segments[3].point.x = barEdgeX;

    graph.text.content = amount + " " + graph.label
    graph.text.position.x = barEdgeX + barTextRelief
}

function updateAllGraphs() {
    var counts = countState()
    updateGraph(graphs.gene[BLUE], counts.gene[BLUE])
    updateGraph(graphs.gene[BROWN], counts.gene[BROWN])
    updateGraph(graphs.trait[BLUE], counts.trait[BLUE])
    updateGraph(graphs.trait[BROWN], counts.trait[BROWN])
    graphs.generation.content = generations + " generations"
}

var announcement = null;
function announce(text) {
    if (announcement != null) {
        //throw "can't announce more than one thing at a time wtf"
        announcement.remove()
    }
    announcement = new PointText([view.size.width / 2, view.size.height]);
    announcement.justification = 'center';
    announcement.fontSize = view.size.width
    announcement.fillColor = 'white'
    announcement.content = text
}

function getRandom(seq) {
    return seq[Math.floor(Math.random() * seq.length)];
}

var isSexing = false
var generations = 0
function sex() {
    if (isSexing) {
        throw "can't sex more, I'm in the middle of sexing!"
    } else {
        isSexing = true
    }
    
    var newPeople = []
    var tempPeople = []
    var originalLength = people.length
    for (var i = 0; i < people.length; i++) {
        tempPeople[i] = people[i]
    }
    
    while (tempPeople.length > 0) {
        var person = tempPeople.shift()
        var removingIndex = Math.random() * tempPeople.length
        var mate = tempPeople.splice(removingIndex, 1)[0]
        
        var pos = randomSpot()
        for(var j = 0; j < 2; j++) {
            var newGenes = [getRandom(person.genes), getRandom(mate.genes)]
            people.push(initPerson(newGenes, pos + [j * 10, 0]))
        }
    }
    for (var i = 0; i < originalLength; i++) {
        var parent = people.shift()
        parent.path.remove()
    }
    
    generations++
    
    updateAllGraphs();
    
    isSexing = false
}

var lastParty = 0
var isSexParty = false
SEX_PARTY_DELAY = 0.5
function onFrame(event) {
    
    // people randomly moving about
    for (var i = 0; i < people.length; i++) {
        people[i].path.translate(Point.random() - [0.5, 0.5]);
    }
    
    if (announcement != null) {
        announcement.fontSize = announcement.fontSize * 0.95;
        announcement.position.y = announcement.position.y * 0.99
        announcement.fillColor.alpha = announcement.fillColor.alpha * 0.97

        if(announcement.fillColor.alpha < 0.01) {
            announcement.remove()
            announcement = null;
        }
    }
    
    if (isSexParty && (event.time - lastParty > SEX_PARTY_DELAY)) {
        lastParty = event.time
        sex()
    }
}

function onMouseDown(event) {
    sex()
    announce('sex!')
}

function onMouseUp(event) {
}

function onKeyUp(event) {
    if (event.key == 'c') {
        isSexParty = !isSexParty
        if(isSexParty) {
            announce("It's party time!")
        }
    }
}

initPeople()
initTitles()
initAllGraphs()
updateAllGraphs()
