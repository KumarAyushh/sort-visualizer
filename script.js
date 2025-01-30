// Global variables
let array = [];
let isSorting = false;
let currentSpeed = 50;
let isPaused = false;
let shouldStop = false;

const explanationElement = document.getElementById('explanation');
const pauseBtn = document.getElementById('pauseBtn');
const resumeBtn = document.getElementById('resumeBtn');
const stopBtn = document.getElementById('stopBtn');

// Theme toggling
document.getElementById('themeToggle').addEventListener('click', () => {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
});

// Initialize the array
function generateNewArray(size = 50) {
    if (isSorting) return;
    array = Array.from({ length: size }, () => Math.floor(Math.random() * 290) + 10);
    drawArray();
}

// Draw the array bars
function drawArray(highlightIndices = []) {
    const container = document.getElementById('array-container');
    container.innerHTML = '';
    array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'array-bar';
        bar.style.height = `${value}px`;
        if (highlightIndices.includes(index)) {
            bar.style.backgroundColor = '#FFA500';
        }
        container.appendChild(bar);
    });
}

// Update array size
function updateArraySize(size) {
    if (!isSorting) {
        generateNewArray(parseInt(size));
    }
}

// Update animation speed
function updateSpeed(speed) {
    currentSpeed = 101 - parseInt(speed);
}

// Sorting Algorithms
async function bubbleSort() {
    startSorting();
    const bars = document.getElementsByClassName('array-bar');
    try {
        for (let i = 0; i < array.length; i++) {
            for (let j = 0; j < array.length - i - 1; j++) {
                await checkPauseAndStop();
                bars[j].style.backgroundColor = '#FF0000';
                bars[j + 1].style.backgroundColor = '#FF0000';
                await sleep(currentSpeed);
                if (array[j] > array[j + 1]) {
                    [array[j], array[j + 1]] = [array[j + 1], array[j]];
                    drawArray([j, j + 1]);
                    await sleep(currentSpeed);
                }
                bars[j].style.backgroundColor = '#4CAF50';
                bars[j + 1].style.backgroundColor = '#4CAF50';
            }
        }
    } catch (error) {
        if (error.message !== 'Sorting stopped') throw error;
    }
    endSorting();
}

async function insertionSort() {
    startSorting();
    const bars = document.getElementsByClassName('array-bar');
    try {
        for (let i = 1; i < array.length; i++) {
            let key = array[i];
            let j = i - 1;
            bars[i].style.backgroundColor = '#FFA500';
            await sleep(currentSpeed);
            while (j >= 0 && array[j] > key) {
                await checkPauseAndStop();
                bars[j].style.backgroundColor = '#FF0000';
                bars[j + 1].style.backgroundColor = '#FF0000';
                await sleep(currentSpeed);
                array[j + 1] = array[j];
                drawArray([j, j + 1]);
                await sleep(currentSpeed);
                bars[j].style.backgroundColor = '#4CAF50';
                bars[j + 1].style.backgroundColor = '#4CAF50';
                j--;
            }
            array[j + 1] = key;
            drawArray([i]);
            await sleep(currentSpeed);
        }
    } catch (error) {
        if (error.message !== 'Sorting stopped') throw error;
    }
    endSorting();
}

async function selectionSort() {
    startSorting();
    const bars = document.getElementsByClassName('array-bar');
    try {
        for (let i = 0; i < array.length - 1; i++) {
            let minIdx = i;
            bars[minIdx].style.backgroundColor = '#FFA500';
            for (let j = i + 1; j < array.length; j++) {
                await checkPauseAndStop();
                bars[j].style.backgroundColor = '#FF0000';
                await sleep(currentSpeed);
                if (array[j] < array[minIdx]) {
                    bars[minIdx].style.backgroundColor = '#4CAF50';
                    minIdx = j;
                    bars[minIdx].style.backgroundColor = '#FFA500';
                } else {
                    bars[j].style.backgroundColor = '#4CAF50';
                }
            }
            if (minIdx !== i) {
                [array[i], array[minIdx]] = [array[minIdx], array[i]];
                drawArray([i, minIdx]);
                await sleep(currentSpeed);
            }
            bars[minIdx].style.backgroundColor = '#4CAF50';
            bars[i].style.backgroundColor = '#45a049';
        }
    } catch (error) {
        if (error.message !== 'Sorting stopped') throw error;
    }
    endSorting();
}

async function mergeSort(start = 0, end = array.length - 1) {
    if (start < end) {
        const mid = Math.floor((start + end) / 2);
        await mergeSort(start, mid);
        await mergeSort(mid + 1, end);
        await merge(start, mid, end);
    } else {
        endSorting();
    }
}

async function merge(start, mid, end) {
    const tempArray = [];
    let i = start, j = mid + 1;
    try {
        while (i <= mid && j <= end) {
            await checkPauseAndStop();
            await highlightCompare(i, j);
            if (array[i] <= array[j]) {
                tempArray.push(array[i++]);
            } else {
                tempArray.push(array[j++]);
            }
        }
        while (i <= mid) tempArray.push(array[i++]);
        while (j <= end) tempArray.push(array[j++]);
        for (let k = start; k <= end; k++) {
            array[k] = tempArray[k - start];
            drawArray([k]);
            await sleep(currentSpeed);
        }
    } catch (error) {
        if (error.message !== 'Sorting stopped') throw error;
    }
}

async function quickSort(low = 0, high = array.length - 1) {
    if (low < high) {
        const pi = await partition(low, high);
        await quickSort(low, pi - 1);
        await quickSort(pi + 1, high);
    } else {
        endSorting();
    }
}

async function partition(low, high) {
    const bars = document.getElementsByClassName('array-bar');
    const pivot = array[high];
    let i = low - 1;
    bars[high].style.backgroundColor = '#FFA500';
    await sleep(currentSpeed);
    try {
        for (let j = low; j < high; j++) {
            await checkPauseAndStop();
            await highlightCompare(j, high);
            if (array[j] < pivot) {
                i++;
                [array[i], array[j]] = [array[j], array[i]];
                drawArray([i, j]);
                await sleep(currentSpeed);
            }
        }
        [array[i + 1], array[high]] = [array[high], array[i + 1]];
        drawArray([i + 1, high]);
        bars[high].style.backgroundColor = '#4CAF50';
        return i + 1;
    } catch (error) {
        if (error.message !== 'Sorting stopped') throw error;
    }
}

// Helper functions
async function highlightCompare(i, j) {
    const bars = document.getElementsByClassName('array-bar');
    bars[i].style.backgroundColor = '#FF0000';
    bars[j].style.backgroundColor = '#FF0000';
    await sleep(currentSpeed);
    bars[i].style.backgroundColor = '#4CAF50';
    bars[j].style.backgroundColor = '#4CAF50';
}

function sleep(ms) {
    return new Promise(resolve => {
        const check = () => {
            if (shouldStop) {
                shouldStop = false;
                isPaused = false;
                throw new Error('Sorting stopped');
            }
            if (!isPaused) {
                setTimeout(resolve, ms);
            } else {
                setTimeout(check, 100);
            }
        };
        check();
    });
}

async function checkPauseAndStop() {
    if (shouldStop) {
        shouldStop = false;
        isPaused = false;
        throw new Error('Sorting stopped');
    }
    while (isPaused) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
}

// Execution control functions
function enableControls(enable) {
    pauseBtn.disabled = !enable;
    stopBtn.disabled = !enable;
    resumeBtn.disabled = true; // Resume is only enabled when paused
}

pauseBtn.addEventListener('click', () => {
    isPaused = true;
    pauseBtn.disabled = true;
    resumeBtn.disabled = false;
});

resumeBtn.addEventListener('click', () => {
    isPaused = false;
    pauseBtn.disabled = false;
    resumeBtn.disabled = true;
});

stopBtn.addEventListener('click', () => {
    shouldStop = true;
    isPaused = false;
    enableControls(false);
});

function startSorting() {
    isSorting = true;
    enableControls(true);
}

function endSorting() {
    isSorting = false;
    enableControls(false);
}

// Explanations object
const explanations = {
    bubbleSort: `
        <h4>Bubble Sort</h4>
        <p><strong>Time Complexity:</strong> O(n²) in all cases</p>
        <p><strong>Space Complexity:</strong> O(1)</p>
        <p><strong>Steps:</strong></p>
        <ol>
            <li>Repeatedly steps through the list</li>
            <li>Compares adjacent elements</li>
            <li>Swaps them if they're in the wrong order</li>
            <li>Continues until no swaps are needed</li>
        </ol>
        <p><strong>Use Case:</strong> Small datasets, educational purposes</p>
    `,
    insertionSort: `
        <h4>Insertion Sort</h4>
        <p><strong>Time Complexity:</strong> O(n²) average/worst, O(n) best</p>
        <p><strong>Space Complexity:</strong> O(1)</p>
        <p><strong>Steps:</strong></p>
        <ol>
            <li>Builds sorted array one item at a time</li>
            <li>Takes each element and inserts it into correct position</li>
            <li>Shifts elements greater than key to the right</li>
        </ol>
        <p><strong>Use Case:</strong> Small or nearly sorted datasets</p>
    `,
    selectionSort: `
        <h4>Selection Sort</h4>
        <p><strong>Time Complexity:</strong> O(n²) in all cases</p>
        <p><strong>Space Complexity:</strong> O(1)</p>
        <p><strong>Steps:</strong></p>
        <ol>
            <li>Divides array into sorted and unsorted parts</li>
            <li>Finds minimum element in unsorted part</li>
            <li>Swaps it with first unsorted element</li>
            <li>Repeats until sorted</li>
        </ol>
        <p><strong>Use Case:</strong> Small datasets, memory constraints</p>
    `,
    mergeSort: `
        <h4>Merge Sort</h4>
        <p><strong>Time Complexity:</strong> O(n log n) in all cases</p>
        <p><strong>Space Complexity:</strong> O(n)</p>
        <p><strong>Steps:</strong></p>
        <ol>
            <li>Divide array into two halves</li>
            <li>Recursively sort each half</li>
            <li>Merge sorted halves</li>
            <li>Merge process compares elements from each half</li>
        </ol>
        <p><strong>Use Case:</strong> Large datasets, stable sorting needed</p>
    `,
    quickSort: `
        <h4>Quick Sort</h4>
        <p><strong>Time Complexity:</strong> O(n log n) average, O(n²) worst</p>
        <p><strong>Space Complexity:</strong> O(log n)</p>
        <p><strong>Steps:</strong></p>
        <ol>
            <li>Choose pivot element</li>
            <li>Partition array into elements less than and greater than pivot</li>
            <li>Recursively apply to sub-arrays</li>
            <li>Combine results</li>
        </ol>
        <p><strong>Use Case:</strong> General purpose, large datasets</p>
    `
};

// Event listeners
document.querySelectorAll('.algo-btn').forEach(button => {
    button.addEventListener('click', function () {
        if (isSorting) return;
        document.querySelectorAll('.algo-btn').forEach(btn =>
            btn.classList.remove('active')
        );
        this.classList.add('active');
        const algorithm = this.dataset.algo;
        updateExplanation(algorithm);
        switch (algorithm) {
            case 'bubbleSort': bubbleSort(); break;
            case 'insertionSort': insertionSort(); break;
            case 'selectionSort': selectionSort(); break;
            case 'mergeSort': mergeSort(); break;
            case 'quickSort': quickSort(); break;
        }
    });
});

// Update explanation display
function updateExplanation(algorithm) {
    explanationElement.innerHTML = explanations[algorithm] ||
        '<p>Select an algorithm to see detailed explanation</p>';
}

// Initialize the visualization on page load
document.addEventListener('DOMContentLoaded', () => {
    generateNewArray();
    updateExplanation();
    document.getElementById('arraySizeSlider').addEventListener('input', function() {
        updateArraySize(this.value);
    });
});