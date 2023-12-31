//초기 설정 값 및 util성 변수 및 함수

import { Alert } from "react-native";

export const randomColor = ({ firstColor, lastColor }) => {
  const letters = "0123456789ABCDEF";
  let color;
  do {
    color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
  } while (color === firstColor || color === lastColor);
  return color;
};

export const carTaxCalculate = (model, useType, price) => {
  const tax = {
    register: price * 0.05,
    get: price * 0.02,
  };
  if (useType === "nonCom") {
    tax.register = price * 0.02;
    tax.get = price * 0.02;
  } else if (useType === "com") {
    if (carType.T1.includes(model)) {
      tax.register = 0;
      tax.get = 0;
    } else if (carType.T2.includes(model)) {
      tax.register = price * 0.03;
      tax.get = price * 0.02;
    }
  }
  return tax;
};
export const carType = {
  T1: [
    "레이",
    "모닝",
    "비스토",
    "마티즈",
    "쉐보레 스파크",
    "티코",
    "블루온",
    "아토스",
    "캐스퍼",
    "트위지",
    "알토라팡",
    "허슬러",
    "미라",
    "미라지노",
    "미라코코아",
    "코펜",
    "탄토",
    "야리스(비츠)",
    "파쏘",
    "모코",
    "N-One",
  ],
  T2: [
    "스타렉스",
    "스타리아",
    "쏠라티",
    "마스터",
    "이스타나",
    "프레지오",
    "서버밴",
    "아스트로밴",
    "익스프레스밴",
    "익스플로러밴",
    "스프린터",
    "사바나",
    "밴",
  ],
};

// 금액 처리 세자리 마다(,)
export const inputPriceFormat = (str) => {
  const comma = (str) => {
    str = String(str);
    return str.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, "$1,");
  };
  const uncomma = (str) => {
    str = String(str);
    return str.replace(/[^\d]+/g, "");
  };
  return comma(uncomma(str));
};

//키보드 타입
export const keyBoardType = (type) => {
  let keyboard;
  switch (type) {
    case "number":
      keyboard = "numeric";
      break;
    case "number2":
      keyboard = "number-pad";
      break;
    case "double":
      keyboard = "decimal-pad";
      break;
    case "email":
      keyboard = "email-address";
      break;
    case "pad":
      keyboard = "phone-pad";
      break;
    case "url":
      keyboard = "url";
      break;
    default:
      keyboard = "default";
      break;
  }
  return keyboard;
};

//기기가 안드로이드 인지 체크
export const isAndroid = Platform.OS === "android";

// date를 yyyy-mm-dd 형태의 string으로 변환하는 함수
export const makeDateString = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month.toString().length > 1 ? month : "0" + month}-${
    day.toString().length > 1 ? day : "0" + day
  }`;
};

// inputTag 관련 공통 style
export const inputTagCommonStyle = {
  backgroundColor: "white",
  width: "100%",
  height: 45,
  borderColor: "#e5e7eb",
  borderWidth: 1,
  padding: 0,
  margin: 0,
  textAlign: "center",
  fontSize: 18,
  color: "black",
};

// 숫자 정규표현식
export const req = {
  num: /^[0-9]/,
};

export const alertText = {
  basic: {
    title: "주의",
    content: "올바른 값을 입력해주세요.",
  },
};

export const inputFormCheckFunction = (key, val1, val2, val3) => {
  let block = false;
  switch (key) {
    case "userId":
      if (val1 === "") {
        Alert.alert("", "아이디를 입력하세요.");
        block = true;
      }
      return block;
    case "userPw":
      if (val1 === "") {
        Alert.alert("", "비밀번호를 입력하세요.");
        block = true;
      } else if (val2 === "") {
        Alert.alert("", "비밀번호 확인을 입력하세요.");
        block = true;
      } else if (val1 !== val2) {
        Alert.alert("", "입력한 비밀번호가 같지 않습니다.");
        block = true;
      }
      return block;
    case "userName":
      if (val1 === "") {
        Alert.alert("", "이름을 입력하세요.");
        block = true;
      }
      return block;
    case "securityNumber":
      if (val1 === "" || val2 === "") {
        Alert.alert("", "주민등록번호를 입력하세요.");
        block = true;
      } else if (
        Number(val2[0]) > 4 ||
        val1.length !== 6 ||
        val2.length !== 7
      ) {
        Alert.alert("", "주민등록번호를 형식이 잘못되었습니다.");
        block = true;
      } else {
        const dateRegex = /^\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])$/;
        if (!dateRegex.test(val1)) {
          Alert.alert("", "주민등록번호의 생년월일이 올바르지 않습니다.");
          block = true;
        }
      }
      return block;
    case "phoneNumber":
      if (val2 === "" || val3 === "") {
        Alert.alert("", "전화번호를 입력하세요.");
        block = true;
      } else {
        if (val2.length < 4 || val3.length < 4) {
          Alert.alert("", "전화번호의 형식이 잘못되었습니다.");
          block = true;
        }
      }
      return block;
    case "email":
      if (val1 === "") {
        Alert.alert("", "이메일을 입력하세요.");
        block = true;
      } else {
        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
        if (!emailRegex.test(val1)) {
          Alert.alert("", "이메일을 형식이 잘못되었습니다.");
          block = true;
        }
      }
      return block;
    case "zonePost":
      if (val1 === "") {
        Alert.alert("", "주소를 입력하세요.");
        block = true;
      }
      return block;
  }
};

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const bankType = [
  "직접입력",
  "신한은행",
  "국민은행",
  "하나은행",
  "우리은행",
  "농협은행",
  "중소기업은행",
  "수협은행",
  "부산은행",
  "광주은행",
  "제주은행",
  "전북은행",
  "경남은행",
  "한국스탠다드차타드은행",
  "카카오뱅크",
  "토스뱅크",
  "케이뱅크",
  "한국산업은행",
];

export const searchNavigate = [
  {
    key: "자산/",
    title: "자산",
    list: [
      {
        key: "예금/",
        title: "예금",
        list: [
          { key: "추가", title: "추가", go: "AddDeposit" },
          { key: "수정", title: "수정", go: "depositUpdate" },
          { key: "서비스", title: "서비스", go: "TempPage" },
        ],
      },
      {
        key: "적금/",
        title: "적금",
        list: [
          { key: "추가", title: "추가", go: "AddDeposit" },
          { key: "수정", title: "수정", go: "savingsUpdate" },
          { key: "서비스", title: "서비스", go: "TempPage" },
        ],
      },
      {
        key: "부동산/",
        title: "부동산",
        list: [
          { key: "추가", title: "추가", go: "AddApt" },
          { key: "수정", title: "수정", go: "TempPage" },
          {
            key: "우리집 시세동향",
            title: "우리집 시세동향",
            go: "AddService",
          },
        ],
      },
      {
        key: "자동차/",
        title: "자동차",
        list: [
          { key: "추가", title: "추가", go: "AddCar" },
          { key: "수정", title: "수정", go: "carUpdate" },
          {
            key: "중고 자동차 추천",
            title: "중고 자동차 추천",
            go: "carService",
          },
          {
            key: "차 취등록세 계산기",
            title: "차 취등록세 계산기",
            go: "carService",
            naviState: 1,
          },
        ],
      },
      {
        key: "주식/",
        title: "주식",
        list: [
          { key: "추가", title: "추가", go: "AddStock" },
          { key: "수정", title: "수정", go: "TempPage" },
          {
            key: "수익률 순위조회",
            title: "수익률 순위조회",
            go: "StockService",
          },
        ],
      },
      {
        key: "코인/",
        title: "코인",
        list: [
          { key: "추가", title: "추가", go: "AddCoin" },
          { key: "수정", title: "수정", go: "TempPage" },
          { key: "서비스", title: "서비스", go: "TempPage" },
        ],
      },
      {
        key: "외환/",
        title: "외환",
        list: [
          { key: "추가", title: "추가", go: "AddExchange" },
          { key: "수정", title: "수정", go: "TempPage" },
          { key: "시세조회", title: "시세조회", go: "currencyGraphPage" },
        ],
      },
      {
        key: "금/",
        title: "금",
        list: [
          { key: "추가", title: "추가", go: "AddGold" },
          { key: "수정", title: "수정", go: "TempPage" },
          { key: "시세조회", title: "시세조회", go: "GoldGraphPage" },
        ],
      },
    ],
  },
  {
    key: "가계부/",
    title: "가계부",
    list: [
      {
        key: "가계부 업로드",
        title: "가계부 업로드",
        go: "AccountBookUpload",
      },
    ],
  },
  {
    key: "부가서비스/",
    title: "부가서비스",
    list: [
      {
        key: "목돈마련 플래너",
        title: "목돈마련 플래너",
        go: "mokdonPlanner",
      },
      {
        key: "예적금 이자계산기",
        title: "예적금 이자계산기",
        go: "mokdonPlanner",
        naviState: 1,
      },
      {
        key: "연말정산 예상 계산기",
        title: "연말정산 예상 계산기",
        go: "calculate",
      },
    ],
  },
];
