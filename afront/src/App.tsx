import { useState } from 'react'


function App() {
  const [count, setCount] = useState(0)


  const encoded = [
    {
      groupId: 783,

      areaId: "0",
      departmentId: "688",
      directionId: "0",
      mediaTypeId: "0",
      mediaId: "676",
      resellingId: "18842",
      serviceTypeId: "124",
      formatTypeId: "0",
      formatId: "0",
      unitId: "82226",
      platformId: "0",
      budgetId: null,
      adPlatformId: "1026",
      service: null,
      formatSize: null,
      ca: null,
      mpmId: null,
    },
    {
      groupId: 784,

      areaId: "0",
      departmentId: "688",
      directionId: "0",
      mediaTypeId: "0",
      mediaId: "676",
      resellingId: "18842",
      serviceTypeId: "124",
      formatTypeId: "0",
      formatId: "0",
      unitId: "82226",
      platformId: "0",
      budgetId: null,
      adPlatformId: "1026",
      service: null,
      formatSize: null,
      ca: null,
      mpmId: null,
    },
    {
      groupId: 785,

      areaId: "0",
      departmentId: "688",
      directionId: "0",
      mediaTypeId: "0",
      mediaId: "676",
      resellingId: "18842",
      serviceTypeId: "124",
      formatTypeId: "0",
      formatId: "0",
      unitId: "82226",
      platformId: "0",
      budgetId: null,
      adPlatformId: "1026",
      service: null,
      formatSize: null,
      ca: null,
      mpmId: null,
    },
    {
      groupId: 786,

      areaId: "0",
      departmentId: "688",
      directionId: "0",
      mediaTypeId: "0",
      mediaId: "676",
      resellingId: "18842",
      serviceTypeId: "124",
      formatTypeId: "0",
      formatId: "0",
      unitId: "82226",
      platformId: "0",
      budgetId: null,
      adPlatformId: "1026",
      service: null,
      formatSize: null,
      ca: null,
      mpmId: null,
    },
    {
      groupId: 787,

      areaId: "0",
      departmentId: "688",
      directionId: "0",
      mediaTypeId: "0",
      mediaId: "676",
      resellingId: "18842",
      serviceTypeId: "124",
      formatTypeId: "0",
      formatId: "0",
      unitId: "82226",
      platformId: "0",
      budgetId: null,
      adPlatformId: "1026",
      service: null,
      formatSize: null,
      ca: null,
      mpmId: null,
    },
    {
      groupId: 788,

      areaId: "0",
      departmentId: "688",
      directionId: "18858",
      mediaTypeId: "111",
      mediaId: "676",
      resellingId: "18842",
      serviceTypeId: "124",
      formatTypeId: "15130",
      formatId: "0",
      unitId: "82226",
      platformId: "0",
      budgetId: null,
      adPlatformId: "1026",
      service: null,
      formatSize: null,
      ca: null,
      mpmId: null,
    },
    {
      groupId: 789,

      areaId: "0",
      departmentId: "688",
      directionId: "18858",
      mediaTypeId: "111",
      mediaId: "676",
      resellingId: "18842",
      serviceTypeId: "124",
      formatTypeId: "15152",
      formatId: "0",
      unitId: "82226",
      platformId: "0",
      budgetId: null,
      adPlatformId: "1026",
      service: null,
      formatSize: null,
      ca: null,
      mpmId: null,
    },
    {
      groupId: 790,

      areaId: "0",
      departmentId: "688",
      directionId: "18858",
      mediaTypeId: "111",
      mediaId: "676",
      resellingId: "18842",
      serviceTypeId: "124",
      formatTypeId: "15130",
      formatId: "0",
      unitId: "82226",
      platformId: "0",
      budgetId: null,
      adPlatformId: "1026",
      service: null,
      formatSize: null,
      ca: null,
      mpmId: null,
    },
    {
      groupId: 791,

      areaId: "0",
      departmentId: "688",
      directionId: "18858",
      mediaTypeId: "111",
      mediaId: "676",
      resellingId: "18842",
      serviceTypeId: "124",
      formatTypeId: "15130",
      formatId: "110639",
      unitId: "82226",
      platformId: "145868",
      budgetId: null,
      adPlatformId: "1557",
      service: null,
      formatSize: "не применим",
      ca: null,
      mpmId: null,
    },
    {
      groupId: 792,

      areaId: "0",
      departmentId: "688",
      directionId: "18858",
      mediaTypeId: "111",
      mediaId: "676",
      resellingId: "18842",
      serviceTypeId: "124",
      formatTypeId: "15130",
      formatId: "110639",
      unitId: "82226",
      platformId: "145868",
      budgetId: null,
      adPlatformId: "1026",
      service: null,
      formatSize: "не применим",
      ca: null,
      mpmId: null,
    },
    {
      groupId: 793,

      areaId: "0",
      departmentId: "688",
      directionId: "18858",
      mediaTypeId: "111",
      mediaId: "676",
      resellingId: "18842",
      serviceTypeId: "124",
      formatTypeId: "15152",
      formatId: "82193",
      unitId: "82226",
      platformId: "0",
      budgetId: null,
      adPlatformId: "1026",
      service: null,
      formatSize: "Не применимо",
      ca: null,
      mpmId: null,
    },
  ];

  const translations = {
    0: "",
    111: "СММ",
    124: " ",
    676: "Диджитал",
    688: "Маркетинг",
    1026: "Telegram",
    1557: "Посевы",
    15130: "СММ - 2",
    15152: "Баннеры",
    18842: "Нет",
    18858: "СММ - 3",
    82193: "Баннеры",
    82226: "Фикс",
    110639: "Статья",
  };

  // const ff = "groupId";
  // console.log(ff.slice(-2) === 'Id');
  // console.log(/Id$/.test(ff));
  // console.log(['groupId'].includes(ff));

  // fetch("https://v6.exchangerate-api.com/v6/a3452c5c9323767018011f68/latest/RUB")
  // .then(res => res.json())
  // .then(data => console.log(data))



  const excludedKeys = new Set(['groupId']);
  console.log(excludedKeys);

  function decodeFields(data, translations) {
    const uniqueIds = new Set();

    const decodedData = data.map((item) => {
      const newItem = {};

      Object.keys(item).forEach(key => {
        if (/Id$/.test(key) && item[key] !== null && !['groupId'].includes(key)) {
          newItem[key] = translations[item[key]] || item[key]; // Use translation or keep original if not found
          uniqueIds.add(item[key]); // Collect unique IDs
        } else {
          newItem[key] = item[key]; // Copy other fields as is
        }
      });

      return newItem;
    });

    console.log("Unique IDs:", Array.from(uniqueIds));
    return decodedData;
  }

  console.log(decodeFields(encoded, translations));

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img  className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
