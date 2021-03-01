import React, { Fragment } from 'react';

import './styles/Header.scss';

class Header extends React.PureComponent {
  render () {
    return (
      <Fragment>
        <div className='header'>
          <div className='header__title'>Washington Metro App</div>
        </div>
        <div className='header-placeholder'></div>
      </Fragment>
    );
  }
}

export default Header;
