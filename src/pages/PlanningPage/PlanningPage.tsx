import React, { useState, Fragment } from 'react';
import { Button, Space, Affix } from 'antd';
import { v4 as uuid } from 'uuid';
import _ from 'lodash';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  ResponderProvided,
} from 'react-beautiful-dnd';
import classnames from 'classnames';

// @ts-ignore
import styles from './PlanningPage.module.less';
import { events } from './events';

// fake data generator
const getItems = (count: number, offset = 0) =>
  Array.from({ length: count }, (v, k) => k).map((k) => ({
    id: `item-${k + offset}-${new Date().getTime()}`,
    content: `item ${k + offset}`,
  }));

const reorder = (list: any[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};
/**
 * Moves an item from one list to another list.
 */
const copy = (
  source: any,
  destination: any,
  droppableSource: any,
  droppableDestination: any,
): any => {
  console.log('==> dest', destination);

  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const item = sourceClone[droppableSource.index];

  destClone.splice(droppableDestination.index, 0, { ...(item as any), id: uuid() });
  return destClone;
};

const remove = (list: any, itemId: string) => {
  return list.filter((item: any) => item.id !== itemId);
};

const move = (
  source: any[],
  destination: any[],
  droppableSource: any,
  droppableDestination: any,
): any => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed);

  const result = {} as any;
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const ITEMS = [
  {
    id: uuid(),
    ...events.travel,
  },
  {
    id: uuid(),
    ...events.propertyPurchase,
  },
  {
    id: uuid(),
    ...events.carPurchase,
  },
  {
    id: uuid(),
    ...events.healthcare,
  },
];

const getDefaultPlan = (age: number) => {
  const ages = _.range(Math.floor(age / 10) * 10, 100, 10);

  const plan = {
    '20': [
      { id: uuid(), ...events.carPurchase },
      { id: uuid(), ...events.travel },
    ],
    '30': [
      { id: uuid(), ...events.marriage },
      { id: uuid(), ...events.propertyPurchase },
      { id: uuid(), ...events.children },
    ],
    '40': [
      { id: uuid(), ...events.familyTrips },
      { id: uuid(), ...events.parentsCare },
    ],
    '50': [{ id: uuid(), ...events.collegeFund }],
    '60': [
      { id: uuid(), ...events.retirement },
      { id: uuid(), ...events.healthcare },
    ],
    '70': [{ id: uuid(), ...events.travel }],
    '80': [],
    '90': [],
  };

  return plan;
};
export const PlanningPage = () => {
  const currentAge = 25;
  const ages = _.range(Math.floor(currentAge / 10) * 10, 100, 10);
  const [state, setState] = useState<{ [key: string]: any[] }>(
    getDefaultPlan(currentAge),
    // ages.reduce(
    //   (acc, curr) => ({
    //     ...acc,
    //     [curr.toString()]: [],
    //   }),
    //   {},
    // ),
  );
  console.log('State', state);

  const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
    const { source, destination } = result;

    console.log('==> result', result);

    // dropped outside the list
    if (!destination) {
      return;
    }

    switch (source.droppableId) {
      case destination.droppableId:
        setState({
          ...state,
          [destination.droppableId]: reorder(
            state[source.droppableId as any],
            source.index,
            destination.index,
          ),
        });
        break;
      case 'ITEMS':
        setState({
          ...state,
          [destination.droppableId]: copy(
            ITEMS,
            state[destination.droppableId],
            source,
            destination,
          ),
        });
        break;
      default:
        setState({
          ...state,
          ...move(
            state[source.droppableId as any],
            state[destination.droppableId as any],
            source,
            destination,
          ),
        });
        break;
    }
  };

  // const addList = (e: any) => {
  //   setState({ ...state, [uuid()]: [] });
  // };

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="ITEMS" isDropDisabled={true}>
            {(provided, snapshot) => (
              <Affix offsetTop={10} className={styles.kioskAffix}>
                <div
                  ref={provided.innerRef}
                  className={classnames([
                    styles.kiosk,
                    { [styles.isDragging]: snapshot.isDraggingOver },
                  ])}
                >
                  {ITEMS.map((item, index) => (
                    <Draggable key={item.id} draggableId={item.id} index={index}>
                      {(provided, snapshot) => (
                        <React.Fragment>
                          <div
                            className={classnames([
                              styles.item,
                              { [styles.isDragging]: snapshot.isDragging },
                            ])}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={provided.draggableProps.style}
                          >
                            {item.icon}&nbsp; {item.title}
                          </div>
                          {snapshot.isDragging && (
                            <div className={styles.clone}>
                              {item.icon}&nbsp; {item.title}
                            </div>
                          )}
                        </React.Fragment>
                      )}
                    </Draggable>
                  ))}
                </div>
              </Affix>
            )}
          </Droppable>
          {Object.keys(state).map((list, i) => {
            console.log('==> list', list);
            return (
              <Droppable key={list} droppableId={list}>
                {(provided, snapshot) => (
                  <Fragment>
                    <p>{list}s</p>
                    <div
                      className={classnames([
                        styles.container,
                        { [styles.isDragging]: snapshot.isDraggingOver },
                      ])}
                      ref={provided.innerRef}
                    >
                      {state[list].length
                        ? state[list].map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  className={classnames([
                                    styles.item,
                                    { [styles.isDragging]: snapshot.isDragging },
                                  ])}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  style={provided.draggableProps.style}
                                >
                                  <div className={styles.handle} {...provided.dragHandleProps}>
                                    <svg width="24" height="24" viewBox="0 0 24 24">
                                      <path
                                        fill="currentColor"
                                        d="M3,15H21V13H3V15M3,19H21V17H3V19M3,11H21V9H3V11M3,5V7H21V5H3Z"
                                      />
                                    </svg>
                                  </div>
                                  {item.icon}&nbsp; {item.title}
                                  {/*<Button*/}
                                  {/*  type="default"*/}
                                  {/*  onClick={() =>*/}
                                  {/*    setState({ ...state, [list]: remove(state[list], item.id) })*/}
                                  {/*  }*/}
                                  {/*>*/}
                                  {/*  X*/}
                                  {/*</Button>*/}
                                </div>
                              )}
                            </Draggable>
                          ))
                        : !provided.placeholder && (
                            <div className={styles.notice}>Drop items here</div>
                          )}
                      {provided.placeholder}
                    </div>
                  </Fragment>
                )}
              </Droppable>
            );
          })}
        </DragDropContext>
      </div>
    </div>
  );
};

export default PlanningPage;
