import React, { useEffect } from "react";

import Lottie from "react-lottie";
import animationData from "../../json/loading.json";
import S from "./loading.module.scss";
import useLoadingStore from "../../store/loading.store";

const Loading: React.FC = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
  };

  const loadingStore = useLoadingStore();

  useEffect(() => {
    document.body.classList.add("no-scroll");
  }, []);

  return loadingStore.loadingState ? (
    <div className={S.loading__container}>
      <Lottie options={defaultOptions} height={220} width={220} />
    </div>
  ) : null;
};

export default Loading;
