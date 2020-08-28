import React from 'react';
import style from './PrettyScroll.module.scss'

interface props {
  title: string
}

class PrettyScroll extends React.Component<props, { }> {
  render() {
    const {title} = this.props;
    return (
      <div className={style.test}>
        {title}
      </div>
    );
  }
}

export default PrettyScroll;