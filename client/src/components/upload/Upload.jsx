import { IKContext, IKImage, IKUpload } from "imagekitio-react";
import { useRef } from "react";

const urlEndpoint = import.meta.env.VITE_IMAGE_KIT_ENDPOINT;
const publicKey = import.meta.env.VITE_IMAGE_KIT_PUBLIC_KEY;

const authenticator = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/upload");

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Request failed with status ${response.status}:${errorText}`,
      );
    }

    const data = await response.json();
    const { signature, expire, token } = data;
    return { signature, expire, token };
  } catch (error) {
    throw new Error(`Authentication request failed: ${error.message}`);
  }
};

const Upload = ({ setImg }) => {
  // 图片上传失败回调
  const onError = (err) => {
    console.log("Error", err);
  };

  // 图片上传成功回调
  const onSuccess = (res) => {
    console.log("Success", res);
    setImg((pre) => {
      return { ...pre, isLoading: false, dbData: res, aiData: res.url };
    });
  };

  // 图片上传进度回调
  const onUploadProgress = (progress) => {
    console.log("Progress", progress);
  };

  // 图片开始上传回调
  const onUploadStart = (evt) => {
    setImg((pre) => {
      return {
        ...pre,
        isLoading: true,
      };
    });
    console.log("Start", evt);
  };

  const ikUploadRef = useRef();

  return (
    <IKContext
      urlEndpoint={urlEndpoint}
      publicKey={publicKey}
      authenticator={authenticator}
    >
      <IKUpload
        fileName="test-upload.png"
        onError={onError}
        onSuccess={onSuccess}
        useUniqueFileName={true}
        onUploadProgress={onUploadProgress}
        onUploadStart={onUploadStart}
        style={{ display: "none" }}
        ref={ikUploadRef}
      />
      {
        <label onClick={() => ikUploadRef.current.click()}>
          <img src="/attachment.png" alt="" />
        </label>
      }
    </IKContext>
  );
};

export default Upload;
