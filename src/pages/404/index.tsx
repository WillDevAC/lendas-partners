import React from 'react';

import { Link } from 'react-router-dom';

import S from './404.module.scss';

const NotFoundPage: React.FC = () => {
  return (
    <div className={S.container404}>
      <div className={S.wrapper404}>
        <h1>404</h1>
        <span>Oops... I don't think this page exists.</span>
      </div>
      <div className={S.wrapperAction}>
        <Link to="/">Back to login</Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
