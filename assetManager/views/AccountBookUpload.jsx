import React, { useState } from "react";
import { View, Alert } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";
import { apiPath } from "../services";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { btnStyle, btnTextStyle2, leftBtnPressStyle } from "../styles";
import { isAddDeleteData } from "../action";

function AccountBookUpload(props) {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.login); //아이디 가져오는 법
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFisrt, setIsFirst] = useState(true);
  const navigation = useNavigation();

  const handleFileSelect = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      console.log("Error selecting file:");

      if (!result.cancelled) {
        setSelectedFile(result.uri);
        setIsFirst(false);
      }
    } catch (error) {
      console.log("Error selecting file:", error);
    }
  };

  const handleFileUpload = async () => {
    try {
      if (!selectedFile) {
        console.log("No file selected.");
        return;
      }

      const fileExtension = selectedFile.split(".").pop(); // 파일 확장자 추출
      const timestamp = Date.now();
      const fileName = `${token}_file_${timestamp}.${fileExtension}`; // 파일 이름 생성

      // 파일을 FormData 객체에 추가
      const formData = new FormData();
      formData.append("file", {
        uri: selectedFile,
        name: fileName,
        type: "text/csv",
      });

      // Axios를 사용하여 파일을 서버로 전송
      await axios
        .post(apiPath + "/rest/webboard/filesave.do", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          data: {
            memberid: token,
          },
        })
        .then((res) => {
          if (res?.data.indexOf("Error") === -1) {
            Alert.alert("저장 완료", "저장에 성공했습니다.", [
              {
                text: "OK",
                onPress: () => {
                  dispatch(isAddDeleteData("Add"));
                  navigation.goBack();
                },
              },
            ]);
          } else {
            Alert.alert("저장 실패", "저장에 실패했습니다.");
          }
        })
        .catch((err) => {
          console.log(err);
        });
      // console.log("File uploaded:", response.data);
    } catch (error) {
      console.log("Error uploading file:", error);
    }
  };

  const fileExtension = selectedFile?.split(".").pop(); // 파일 확장자 추출

  return (
    <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }}>
      <Button
        {...btnStyle}
        _text={btnTextStyle2}
        _pressed={leftBtnPressStyle}
        onPress={handleFileSelect}
      >
        파일 선택하기
      </Button>

      {fileExtension !== "csv" &&
        !isFisrt &&
        Alert.alert("잘못된 확장자입니다.", "csv 파일 유형으로 등록해주세요.")}

      {selectedFile && fileExtension === "csv" && (
        <>
          <Button
            {...btnStyle}
            style={{ marginTop: 20 }}
            _text={btnTextStyle2}
            _pressed={leftBtnPressStyle}
            onPress={handleFileUpload}
          >
            파일 저장하기
          </Button>
        </>
      )}
    </View>
  );
}

export default AccountBookUpload;
