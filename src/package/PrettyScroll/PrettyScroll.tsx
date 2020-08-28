import React from "react";
import styles from "./PrettyScroll.module.scss";

interface props {
  children: React.ReactNode
}

interface state {
  height: number;
  scrollTop: number;
}

class PrettyScroll extends React.Component<props, state> {
  private contentRef = React.createRef<HTMLDivElement>();

  state = {
    height: 0,
    scrollTop: 0,
  };

  handleScroll = () => {
    const container = this.contentRef.current!;
    this.setState({
      scrollTop: container.scrollTop / this.maxScrollTop,
    });
  };

  maxScrollTop: number = 0;
  threshold: number = 10;
  canDrag: boolean = false;
  prepareToDrag: boolean = false;
  dragStart = {
    x: 0,
    y: 0,
  };
  dragDelta = {
    x: 0,
    y: 0,
  };

  handleMouseDown = (e: MouseEvent) => {
    console.log("handleMouseDown");
    this.prepareToDrag = true;
    this.dragStart = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  handleMouseUp = (e: MouseEvent) => {
    console.log("handleMouseUp");
    this.prepareToDrag = false;
  };

  handleMouseMove = (e: MouseEvent) => {
    if (this.prepareToDrag) {
      // console.log("handleMouseMove");
      const container = this.contentRef.current!;
      this.dragDelta = {
        x: this.dragStart.x - e.clientX,
        y: this.dragStart.y - e.clientY,
      };

      container.scrollTo(
        container.scrollLeft + this.dragDelta.x,
        container.scrollTop + this.dragDelta.y
      );
      this.dragStart = {
        x: e.clientX,
        y: e.clientY,
      };
    }
  };

  componentDidMount() {
    const container = this.contentRef.current!;
    const content = container.children[0] as HTMLElement;

    this.maxScrollTop = content?.offsetHeight - container?.clientHeight;
    container.addEventListener("scroll", this.handleScroll);
    container.addEventListener("mousedown", this.handleMouseDown);
    container.addEventListener("mouseup", this.handleMouseUp);
    container.addEventListener("mouseout", this.handleMouseUp);
    container.addEventListener("mousemove", this.handleMouseMove);

    this.setState({
      height: this.contentRef.current!.clientHeight,
    });
  }

  componentWillUnmount() {
    const container = this.contentRef.current!;
    container.removeEventListener("scroll", this.handleScroll);
  }

  componentDidUpdate() {}

  render() {
    const { scrollTop } = this.state;
    const scrollbarHeight = 100;
    const container = this.contentRef.current;
    const maxScroll = container
      ? container.clientHeight - scrollbarHeight
      : 100;

    console.log("scrollTop ", scrollTop);
    console.log("maxScroll ", maxScroll);
    console.log("scrollTop * maxScroll ", scrollTop * maxScroll);

    return (
      <div className={styles.mainContainer}>
        <div className={styles.overlay}>
          <div ref={this.contentRef} className={styles.contentContainer}>
            {this.props.children}
          </div>
        </div>
        <div className={styles.verticalScrollbarContainer}>
          <div
            className={styles.verticalScrollbar}
            style={{
              top: `${scrollTop * maxScroll}px`,
              height: `${scrollbarHeight}px`,
            }}
          />
        </div>
      </div>
    );
  }
}

export default PrettyScroll;
