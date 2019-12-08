// Вспомогательные функции
const m = (X) => X;
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getTwoUniqueRandNumber = (min, max) => {
  let a, b;
  while(!a || !b || a === b) {
    a = rand(min, max);
    b = rand(min, max);
  }
  return [a, b];
};

const average = (numbers) => numbers.reduce((ac, number) => ac += number, 0) / numbers.length;

const generateProgrammers = (count) => {
  const programmers = [];
  for(let i = 1; i <= count; i++) {
    programmers.push('Programmer ' + i);
  }
  return programmers;
};

const generateProgrammersTime = (count) => {
  const times = [];
  for(let i = 0; i < count; i++) {
    times.push(rand(1, 20))
  }
  return times;
};

const generatex = (Ncount, M) => {
  const x = [];
  for(let i = 1; i <= Ncount; i++) {
    x.push(rand(1, M));
  }
  return x;
};

const generateX = (xCount, Ncount, M) => {
  const X = [];
  for(let i = 1; i <= xCount; i++) {
    X.push(generatex(Ncount, M));
  }
  return X;
};

const getIdsOfProgrammersInGroup = (x, j) => {
  // get ids of programmers in certain group
  const ids = [];
  x.forEach((groupNumber, programmersNumber) => {
    if (groupNumber === j) {
      ids.push(programmersNumber);
    }
  });
  return ids;
};

const calculatedikForCertainGroup = (ids, D) => {
  // calculate sum of D matrix value
  let sum = 0;
  if (ids.length > 1) {
    ids.forEach((id) => {
      ids.forEach((i) => {
        if (i !== id) {
          sum += D[id][i];
        }
      })
    });
  }
  return sum;
};

const fx = (x, M, D, totalTime) => {
  let dik = 0;
  let maxProgInGroup = 0;
  for(let j = 1; j <= M; j++) {
    const ids = getIdsOfProgrammersInGroup(x, j); // взятие программистов в одной группе j
    if (ids.length > maxProgInGroup) {
      maxProgInGroup = ids.length
    }
    dik += calculatedikForCertainGroup(ids, D);

  }
  const res = totalTime + relationWithProgCountInOneGroup(maxProgInGroup, totalTime) + relation(dik, totalTime);
  return res;
};

const generatefxs = (X, M, D, totalTime) => {
  const fxs = [];
  X.forEach((x) => {
    fxs.push(fx(x, M, D, totalTime));
  });
  return fxs;
};

const calculateFx = (fx, maxfx) => (maxfx - fx);
const calculateFxs = (fxs, maxfx) => {
  const Fxs = [];
  fxs.forEach((fx) => {
    Fxs.push(calculateFx(fx, maxfx));
  });
  return Fxs;
};

const px = (Fx, Fxs) => Fx/(Fxs.reduce((acc, Fx) => (acc += Fx), 0));

const getMaxpxIndex = (pxs) => {
  let maxpx = -1, maxIndex;
  pxs.forEach((px, index) => {
    if (px > maxpx) {
      maxpx = px;
      maxIndex = index;
    }
  });
  return maxIndex;
};

const removepx = (pxs, index) => pxs[index] = -1;

const chooseParents = (Fxs, X, count) => {
  // calculate probability to be parents for next generation of population
  let pxs = [];
  Fxs.forEach((Fx) => {
    pxs.push(px(Fx, Fxs));
  });

  if (pxs.every((px) => isNaN(px))) {
    pxs = pxs.map((px) => 0.01);
  }

  /*
  find max probability, get x for this probability, add to parents,
  set this probability to -1 for find next max probability
  */
  const parents = []; // next parents
  for(let i = 0; i < count; i++) {
    let maxIndex = getMaxpxIndex(pxs);
    removepx(pxs, maxIndex);
    parents.push(X[maxIndex]);
  }
  return parents;
};

const crossbreeding = (pxs, crossCount) => {
  const pxsNew = [];
  const pxsCopy = [...pxs];
  for(let i = 0; i < crossCount; i++) {
    pxsNew.push(...cross(pxsCopy));
  }
  return pxsNew;
};

const cross = (psx) => {
  const [xIndex, yIndex] = getTwoUniqueRandNumber(0, psx.length - 1); // индексы двух случайных хромосом
  const x = psx[xIndex], y = psx[yIndex]; // две случайные хромосомы
  const [v ,u] = getTwoUniqueRandNumber(0, x.length - 1); // две позиции включая которые и в промежутке которых будет производится скрезивание
  const from = v < u ? v : u;
  const to = v > u ? v : u;
  const xSwapSector = [...x].splice(from, to - from + 1);
  const ySwapSector = [...y].splice(from, to - from + 1);
  const c = [...x], d = [...y];
  c.splice(from, to - from + 1, ...ySwapSector); //  изменяем хромосомы
  d.splice(from, to - from + 1, ...xSwapSector);
  return [c, d];
};

const relation = (p, totalTime) => {
  if (p > 50) { p = 50 }
  return func(p, totalTime)
};

const func = (p, totalTime) => totalTime - ((100 - p) * totalTime / 100);

const relationWithProgCountInOneGroup = (maxCount, totalTime) => 0.2*func(maxCount*maxCount, totalTime);

export const start = (M, programmersCount, D, initIterationCount, isOptimalType, totalTime) => {

  /* ======== Инициализация ======== */
  let iterationCount;
  if (isOptimalType) {
     iterationCount = 300
  } else {
    iterationCount = initIterationCount;
  }

  const xCount = (programmersCount * 4) * 3; // кол-во хромосом
  let X = generateX(xCount, programmersCount, M); // хромосомы [[1,2,2,1], [1,1,1,2], ... ]
  /* ======== Начало ======== */
  let index = 0;
  const chartLabels = [];
  const chartData = generateChartData(xCount);
  const chartDataAverage = [{data: [], label: 'среднее'}];
  while(iterationCount > 0) {
    const fxs = generatefxs(X, M, D, totalTime);
    chartLabels.push(iterationCount);
    fxs.forEach((fx, index) => {
      chartData[index].data.push(fx);
    });
    chartDataAverage[0].data.push(average(fxs));
    const maxfx = Math.max(...fxs);
    const Fxs = calculateFxs(fxs, maxfx);

    /* ======== Выбор хромосом из популяции ======== */
    const pxs = chooseParents(Fxs, X, xCount / 2); // родители

    /* ======== Скрещивание ======== */
    X = crossbreeding(pxs, xCount / 2);

    /* ======== Мутация ======== */
    X = m(X);

    if (checkIfOptimal(chartDataAverage[0].data)) break;

    iterationCount--;
    index++;
  }

  return [chartData, chartLabels, X, chartDataAverage];
};

const checkIfOptimal = (Xs) => {
  let res = false;
  const equalCount = 10;
  const a = Xs.slice(-equalCount);
  if (a.filter((b) => b === a[0]).length === equalCount) res = true;
  return res;
};

const generateChartData = (count) => {
  const chartData = [];
  for(let i = 0; i < count; i++) {
    chartData.push({data:[], label: i+1});
  }
  return chartData;
};
