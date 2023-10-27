import React, { useEffect } from "react";

import Lottie from "lottie-react";
import animationData from "../../json/loading.json";
import S from "./loading.module.scss";
import useLoadingStore from "../../store/loading.store";

const Loading: React.FC = () => {
  const loadingStore = useLoadingStore();

  useEffect(() => {
    document.body.classList.add("no-scroll");
  }, []);

  return loadingStore.loadingState ? (
    <div className={S.loading__container}>
      <div style={{ width: "200px", height: "200px" }}>
        <Lottie animationData={animationData} />
      </div>
    </div>
  ) : null;
};

export default Loading;
