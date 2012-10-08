var BLUE = {
    name: 'blue',
    color: '#29f',
    isDominant: false
    };
var BROWN = {
    name: 'brown',
    color: '#930',
    isDominant: true
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
    return group;
}

// init gene pool
var genePool = []
for (var i = 0; i < initAmount; i++) {
    genePool.push(BLUE);
    genePool.push(BROWN);
}
shuffle(genePool);

function initPeople() {
    var width = view.size.width;
    var height = view.size.height;
    var people = []
    for (var i = 0; i < initAmount; i++) {
        var genes = [genePool.shift(), genePool.shift()];
        var pos = new Point(Math.random() * (width - 2 * MARGIN) + MARGIN, Math.random() * (height - 2 * MARGIN) + MARGIN);
        var personPath = initPerson(genes, pos);
        people[i] = {
                    genes: genes,
                    path: personPath
                    }
    }
    return people;
}
var people = initPeople();

function initUI() {
    messages = ["TraitSim", 'Simulate recessive and dominant gene demographics', "Click anywhere for sex"];
    for(var i = 0; i < messages.length; i++) {
        var text = new PointText([view.size.width / 2, 25 + i * 25]);
        text.justification = 'center';
        text.fillColor = 'white';
        text.content = messages[i];
        text.fontSize = 15;
    }
}
initUI();

function countState(people) {
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
function initGraph(pos, amount, label, color) {
    var rightX = barMaxWidth * amount / 100;
    path = new Path.Rectangle(pos, new Size(rightX, barMaxThickness))
    path.style = {
        fillColor: color,
        //strokeWidth: GENE_WIDTH,
        //strokeCap: 'round'
    };
    var text = new PointText(pos + [rightX + 5, barMaxThickness - 5]);
    text.fontSize = 10
    text.fillColor = 'white'
    text.content = label
    return {
        path: path,
        text: text,
        pos: pos,
        amount: amount,
        label: label
    };
}

var graphs = {}
graphs.gene = {}
graphs.gene[BLUE] = initGraph(new Point(10, 10), 50, 'blue genes', BLUE.color)
graphs.gene[BROWN] = initGraph(new Point(10, 40), 50, 'brown genes', BROWN.color)
graphs.trait = {}
graphs.trait[BLUE] = initGraph(new Point(10, 70), 50, 'blue eyes', BLUE.color)
graphs.trait[BROWN] = initGraph(new Point(10, 100), 50, 'brown eyes', BROWN.color)

function updateGraph(graph, amount) {
    graph.path.width = barMaxWidth * amount / 100;
    graph.text.content = amount + " " + graph.label
}

function updateAllGraphs() {
    var counts = countState(people)
    updateGraph(graphs.gene[BLUE], counts.gene[BLUE])
    updateGraph(graphs.gene[BROWN], counts.gene[BROWN])
    updateGraph(graphs.trait[BLUE], counts.trait[BLUE])
    updateGraph(graphs.trait[BROWN], counts.trait[BROWN])
}
updateAllGraphs();

function onFrame(event) {
    for (var i = 0; i < people.length; i++) {
        people[i].path.translate(new Point(Math.random() * 1 - 0.5, Math.random() * 1 - 0.5));
    }
}

function onMouseDown(event) {
}

function onMouseUp(event) {
}