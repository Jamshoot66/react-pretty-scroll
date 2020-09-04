import React from "react";
import styles from "./PrettyScroll.module.scss";
import { Vector2, ScrollType } from "../../utils/types";

interface Props {
  children: React.ReactNode;
  isHorizontal?: boolean | undefined | null;
  isVertical?: boolean | undefined | null;
  isDraggable?: boolean;
  dragThreshold?: number;
  width?: number | string;
  height?: number | string;
}

interface State {
  height: number;
  scrollTop: number;
  scrollLeft: number;
  scrollType: ScrollType;
}

class PrettyScroll extends React.Component<Props, State> {
  private contentRef = React.createRef<HTMLDivElement>();
  private verticalBarRef = React.createRef<HTMLDivElement>();
  private horizontalBarRef = React.createRef<HTMLDivElement>();

  static defaultProps: Props = {
    children: <div />,
    isHorizontal: null,
    isVertical: null,
    isDraggable: false,
    dragThreshold: 10,
    width: "100%",
    height: "100%",
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      height: 0,
      scrollTop: 0,
      scrollLeft: 0,
      scrollType: this.detectScrolls(),
    };
  }

  detectScrolls = (): ScrollType => {
    //FIXME: implement scroll bars detection via content size;
    const { isVertical, isHorizontal } = this.props;

    if (isVertical && isHorizontal) return ScrollType.both;
    if (isHorizontal) return ScrollType.horizontal;
    if (isVertical) return ScrollType.vertical;

    //default
    return ScrollType.vertical;
  };

  handleScroll = () => {
    const container = this.contentRef.current!;
    this.setState({
      scrollTop: container.scrollTop / this.maxScrollTop,
      scrollLeft: container.scrollLeft / this.maxScrollLeft,
    });
  };

  maxScrollTop: number = 0;
  maxScrollLeft: number = 0;

  prepareToDrag: boolean = false;
  dragStart: Vector2 = {
    x: 0,
    y: 0,
  };
  dragDelta: Vector2 = {
    x: 0,
    y: 0,
  };

  handleMouseDown = (e: MouseEvent) => {
    const { isDraggable } = this.props;
    if (!isDraggable) return;
    this.prepareToDrag = true;
    this.dragStart = {
      x: e.clientX,
      y: e.clientY,
    };
  };

  handleMouseUp = (e: MouseEvent) => {
    this.prepareToDrag = false;
  };

  handleMouseMove = (e: MouseEvent) => {
    if (this.prepareToDrag) {
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
    this.maxScrollLeft = content?.offsetWidth - container?.clientWidth;

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
    container.removeEventListener("mousedown", this.handleMouseDown);
    container.removeEventListener("mouseup", this.handleMouseUp);
    container.removeEventListener("mouseout", this.handleMouseUp);
    container.removeEventListener("mousemove", this.handleMouseMove);
  }

  componentDidUpdate() {}

  render() {
    const { scrollTop, scrollLeft, scrollType } = this.state;
    const { isDraggable, width, height } = this.props;
    const scrollbarHeight = 100;
    const container = this.contentRef.current;
    const maxScroll = container
      ? container.clientHeight - scrollbarHeight
      : 100;

    const contentStyles = [styles.contentContainer];
    if (scrollType === ScrollType.horizontal)
      contentStyles.push(styles.contentContainer_horizontal);
    if (scrollType === ScrollType.vertical)
      contentStyles.push(styles.contentContainer_vertical);
    if (isDraggable) contentStyles.push(styles.unselectable);

    return (
      <div className={styles.mainContainer}>
        <div className={styles.overlay}>
          <div
            ref={this.contentRef}
            className={contentStyles.join(" ")}
            style={{ width, height }}
          >
            {this.props.children}
          </div>
        </div>

        {scrollType === ScrollType.vertical && (
          <div
            className={styles.verticalScrollbarContainer}
            ref={this.verticalBarRef}
          >
            <div
              className={styles.verticalScrollbar}
              style={{
                top: `${scrollTop * maxScroll}px`,
                height: `${scrollbarHeight}px`,
              }}
            />
          </div>
        )}

        {scrollType === ScrollType.horizontal && (
          <div
            className={styles.horizontalScrollbarContainer}
            ref={this.horizontalBarRef}
          >
            <div
              className={styles.horizontalScrollbar}
              style={{
                left: `${scrollLeft * maxScroll}px`,
                width: `${scrollbarHeight}px`,
              }}
            />
          </div>
        )}
      </div>
    );
  }
}

export default PrettyScroll;
