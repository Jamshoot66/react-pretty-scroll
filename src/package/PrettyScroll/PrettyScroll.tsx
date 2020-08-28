import React from 'react';

interface props {
  title: string
}

class PrettyScroll extends React.Component<props, { }> {
  render() {
    const {title} = this.props;
    return (
      <div>
        {title}
      </div>
    );
  }
}

export default PrettyScroll;