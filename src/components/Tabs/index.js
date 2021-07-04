import React from "react";
import styled from "styled-components";

const TabsWrapper = styled.div`
  display: grid;
`;

const ActiveLine = styled.div`
  height: 3px;
  width: ${(p) => `${p.width}px`};
  transform: translateX(${(p) => `${p.offset}px`});
  background: #5096ff;
  transition: all 350ms cubic-bezier(0.15, 0.3, 0.25, 1);
`;

const TabList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  position: relative;
  display: flex;
`;
const TabItem = styled.li`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  width: 50%;
  text-align: center;

  & > span {
    font-size: 18px;
    letter-spacing: 0.6px;
    margin-left: 15px;
    color: #5096ff;
  }
  & > img {
    width: 30px;
    height: auto;
  }

  @media screen and (max-width: 600px) {
    flex-direction: column;
    padding: 10px 15px;

    & > span {
      font-size: 16px;
      letter-spacing: 0.5px;
      margin-left: 0px;
      margin-top: 10px;
    }
  }
  &.is-active {
  }
`;

const Tabs = ({ selected, items, onChange }) => {
  const activeRef = React.createRef();
  const none = React.createRef();
  const [offset, setOffset] = React.useState(0);
  const [width, setWidth] = React.useState(0);

  React.useEffect(() => {
    const activeElement = activeRef.current;
    setOffset(activeElement.offsetLeft);
    setWidth(activeElement.clientWidth);
  }, [selected, activeRef]);

  return (
    <TabsWrapper>
      <TabList>
        {items.map((item) => {
          return (
            <TabItem
              key={item.to}
              ref={selected === item.to ? activeRef : none}
              className={selected === item.to ? "is-active" : ""}
              onClick={() => onChange(item.to)}
            >
              <img src={item.icon} alt="" />
              <span>{item.name}</span>
            </TabItem>
          );
        })}
      </TabList>
      <ActiveLine width={width} offset={offset} />
    </TabsWrapper>
  );
};

export default Tabs;
