import React from "react";
import PrettyScroll from "package/PrettyScroll";

interface props {

}

class Playground extends React.Component<props> {
  private readonly content: React.ReactNode = <div/>;
  private readonly items: Number = 1000;

  prepareContent = () => {
    const content : React.ReactNode[] = [];
    for (let i: number = 0; i < this.items; i++) {
      content.push(`some ${i} `);
    }
    return content;
  }
  
  constructor(props: props) {
    super(props);
    this.content = <div>
      {this.prepareContent()}
    </div>
  }
  
  render() {
    return <PrettyScroll>{this.content}</PrettyScroll>;
  }
}

export default Playground;
