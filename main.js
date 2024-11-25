//тут должен быть адрес сервера для получения данных, но его не было в задании, поэтому сюда можно поставить любой из примеров
async function getData() {
  return await fetch('https://rcslabs.ru/ttrp1.json').then(result => result.json()); 
}

function createHeader(data) {
  const titleName = data.title;

  const header = document.createElement('div');
  const title = document.createElement('h1');
  const menu = document.createElement('div');

  header.classList.add('header');
  title.classList.add('title');

  title.textContent = `Количество пройденных тестов “${titleName}”`;
  menu.innerHTML = 
  `<svg width="14" height="3" viewBox="0 0 14 3" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 3C1.60218 3 1.22064 2.84196 0.93934 2.56066C0.658035 2.27936 0.5 1.89782 0.5 1.5C0.5 1.10218 0.658035 0.720644 0.93934 0.43934C1.22064 0.158035 1.60218 0 2 0C2.39782 0 2.77936 0.158035 3.06066 0.43934C3.34196 0.720644 3.5 1.10218 3.5 1.5C3.5 1.89782 3.34196 2.27936 3.06066 2.56066C2.77936 2.84196 2.39782 3 2 3ZM7 3C6.60218 3 6.22064 2.84196 5.93934 2.56066C5.65804 2.27936 5.5 1.89782 5.5 1.5C5.5 1.10218 5.65804 0.720644 5.93934 0.43934C6.22064 0.158035 6.60218 0 7 0C7.39782 0 7.77936 0.158035 8.06066 0.43934C8.34196 0.720644 8.5 1.10218 8.5 1.5C8.5 1.89782 8.34196 2.27936 8.06066 2.56066C7.77936 2.84196 7.39782 3 7 3ZM12 3C11.6022 3 11.2206 2.84196 10.9393 2.56066C10.658 2.27936 10.5 1.89782 10.5 1.5C10.5 1.10218 10.658 0.720644 10.9393 0.43934C11.2206 0.158035 11.6022 0 12 0C12.3978 0 12.7794 0.158035 13.0607 0.43934C13.342 0.720644 13.5 1.10218 13.5 1.5C13.5 1.89782 13.342 2.27936 13.0607 2.56066C12.7794 2.84196 12.3978 3 12 3Z" fill="#898290"/>
  </svg>`;

  header.append(title, menu);

  return header;
}

function createGraph(data) {
  const graph = document.createElement('div');
  graph.classList.add('graph');

  const dev = createGraphItem(data, 'dev');
  const test = createGraphItem(data, 'test');
  const prod = createGraphItem(data, 'prod');
  const norm = createGraphItem(data, 'норматив');

  graph.append(dev, test, prod, norm);

  return graph;
}

function createGraphItem(data, type) {
  const graphItem = document.createElement('div');
  const graphItemRatio = document.createElement('div');
  const graphItemDescr = document.createElement('div');
  graphItem.classList.add('graph__item');
  graphItemRatio.classList.add('graph__ratio');
  graphItemDescr.classList.add('graph__descr');
  graphItemDescr.textContent = `${type}`;
  
  const maxHeight = Math.max(
    (data.dev.front + data.dev.back + data.dev.db),
    (data.prod.front + data.prod.back + data.prod.db),
    (data.test.front + data.test.back + data.test.db)
  );

  if( type === 'норматив') {
    graphItemRatio.classList.add('graph__item--norm');
    graphItemRatio.style.height = `${(data.norm) / maxHeight * 80}%`;
    const graphItemRatioNumber = document.createElement('div');
    graphItemRatioNumber.classList.add('graph__norm');
    graphItemRatioNumber.textContent = `${data.norm}`;
    graphItemRatio.append(graphItemRatioNumber);
  } else {
    const graphItemRatioFront = document.createElement('div');
    const graphItemRatioBack = document.createElement('div');
    const graphItemRatioDb = document.createElement('div');
    graphItemRatioFront.classList.add('graph__front');
    graphItemRatioBack.classList.add('graph__back');
    graphItemRatioDb.classList.add('graph__db');

  
    switch(type) {
      case 'dev':
        graphItemRatio.style.height = `${(data.dev.front + data.dev.back + data.dev.db) / maxHeight * 80}%`;
        graphItemRatioFront.style.height = `${data.dev.front / (data.dev.front + data.dev.back + data.dev.db) * 100}%`;
        graphItemRatioBack.style.height = `${data.dev.back / (data.dev.front + data.dev.back + data.dev.db) * 100}%`;
        graphItemRatioDb.style.height = `${data.dev.db / (data.dev.front + data.dev.back + data.dev.db) * 100}%`;
        graphItemRatioFront.textContent = `${data.dev.front}`;
        graphItemRatioBack.textContent = `${data.dev.back}`;
        graphItemRatioDb.textContent = `${data.dev.db}`;

        const arrowUpDev = document.createElement('div');
        const horArrowDev = document.createElement('div');
        const devToTestDiff = document.createElement('div');
        arrowUpDev.classList.add('grahp__vertical-arrow');
        horArrowDev.classList.add('graph__horisontal-arrow');
        devToTestDiff.classList.add('graph__diff');

        arrowUpDev.style.height = `calc(100% - ${graphItemRatio.style.height} - 30px)`;
        horArrowDev.style.left = '50%';
        devToTestDiff.style.left = 'calc(100% + 10px)';

        devToTestDiff.textContent = (data.test.front + data.test.back + data.test.db) - (data.dev.front + data.dev.back + data.dev.db);

        if((data.dev.front + data.dev.back + data.dev.db) < (data.test.front + data.test.back + data.test.db)) {
          devToTestDiff.classList.add('graph__diff--positive');
          devToTestDiff.textContent = `+${devToTestDiff.textContent}`
        } else if ((data.dev.front + data.dev.back + data.dev.db) > (data.test.front + data.test.back + data.test.db)) {
          devToTestDiff.classList.add('graph__diff--negative');
        }

        graphItem.append(arrowUpDev, horArrowDev, devToTestDiff);
        break;
      case 'test':
        graphItemRatio.style.height = `${(data.test.front + data.test.back + data.test.db) / maxHeight * 80}%`;
        graphItemRatioFront.style.height = `${data.test.front / (data.test.front + data.test.back + data.test.db) * 100}%`;
        graphItemRatioBack.style.height = `${data.test.back / (data.test.front + data.test.back + data.test.db) * 100}%`;
        graphItemRatioDb.style.height = `${data.test.db / (data.test.front + data.test.back + data.test.db) * 100}%`;
        graphItemRatioFront.textContent = `${data.test.front}`;
        graphItemRatioBack.textContent = `${data.test.back}`;
        graphItemRatioDb.textContent = `${data.test.db}`;

        const arrowUpTest = document.createElement('div');
        const arrowDownTest = document.createElement('div');
        const arrowPointTest = document.createElement('div');
        arrowUpTest.classList.add('grahp__vertical-arrow');
        arrowDownTest.classList.add('grahp__vertical-arrow');
        arrowPointTest.classList.add('grahp__vertical-arrow--down');

        arrowUpTest.style.height = `calc(100% - ${graphItemRatio.style.height} - 30px)`;
        arrowDownTest.style.height = `calc(100% - ${graphItemRatio.style.height} - 30px)`;
        arrowDownTest.style.left = '25%';
        arrowUpTest.style.left = '75%';
        arrowPointTest.style.left = 'calc(25% - 4px)';
        arrowPointTest.style.top = `calc(100% - ${graphItemRatio.style.height} - 40px)`;

        graphItem.append(arrowUpTest, arrowDownTest, arrowPointTest);
        break;
      case 'prod':
        graphItemRatio.style.height = `${(data.prod.front + data.prod.back + data.prod.db) / maxHeight * 80}%`;
        graphItemRatioFront.style.height = `${data.prod.front / (data.prod.front + data.prod.back + data.prod.db) * 100}%`;
        graphItemRatioBack.style.height = `${data.prod.back / (data.prod.front + data.prod.back + data.prod.db) * 100}%`;
        graphItemRatioDb.style.height = `${data.prod.db / (data.prod.front + data.prod.back + data.prod.db) * 100}%`;
        graphItemRatioFront.textContent = `${data.prod.front}`;
        graphItemRatioBack.textContent = `${data.prod.back}`;
        graphItemRatioDb.textContent = `${data.prod.db}`;

        const arrowDownProd = document.createElement('div');
        const horArrowProd = document.createElement('div');
        const arrowPointProd = document.createElement('div');
        const testToProdDiff = document.createElement('div');
        arrowDownProd.classList.add('grahp__vertical-arrow');
        horArrowProd.classList.add('graph__horisontal-arrow');
        arrowPointProd.classList.add('grahp__vertical-arrow--down');
        testToProdDiff.classList.add('graph__diff');

        arrowDownProd.style.height = `calc(100% - ${graphItemRatio.style.height} - 30px)`;
        horArrowProd.style.right = '50%';
        arrowPointProd.style.left = 'calc(50% - 5px)';
        arrowPointProd.style.top = `calc(100% - ${graphItemRatio.style.height} - 40px)`;
        testToProdDiff.style.right = 'calc(100% + 10px)';

        testToProdDiff.textContent = (data.prod.front + data.prod.back + data.prod.db) - (data.test.front + data.test.back + data.test.db);

        if((data.test.front + data.test.back + data.test.db) < (data.prod.front + data.prod.back + data.prod.db)) {
          testToProdDiff.classList.add('graph__diff--positive');
          testToProdDiff.textContent = `+${testToProdDiff.textContent}`
        } else if ((data.test.front + data.test.back + data.test.db) > (data.prod.front + data.prod.back + data.prod.db)) {
          testToProdDiff.classList.add('graph__diff--negative');
        };

        graphItem.append(arrowDownProd, horArrowProd, arrowPointProd, testToProdDiff);
        break;
    }
  
    graphItemRatio.append(graphItemRatioFront, graphItemRatioBack, graphItemRatioDb);
  }

  graphItem.append(graphItemRatio, graphItemDescr);

  return graphItem;
}

function createFooter() {
  const footer = document.createElement('footer');
  const footerFront = document.createElement('div');
  const footerBack = document.createElement('div');
  const footerDb = document.createElement('div');

  footer.classList.add('footer');
  footerFront.classList.add('footer__item', 'footer__item--front');
  footerBack.classList.add('footer__item', 'footer__item--back');
  footerDb.classList.add('footer__item', 'footer__item--db');
  
  footerFront.textContent = 'Клиентская часть';
  footerBack.textContent = 'Серверная часть';
  footerDb.textContent = 'База данных';

  footer.append(footerFront, footerBack, footerDb);

  return footer;
}

async function start() {
  const app = document.querySelector('.app');

  const data = await getData();

  const header = createHeader(data);
  const graph = createGraph(data);
  const footer = createFooter();
  
  app.append(header, graph, footer);
}

start();