/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import {
  DraggableCollectionOptions,
  DraggableCollectionState,
  DroppableCollectionState,
  DroppableCollectionStateOptions,
  useDraggableCollectionState,
  useDroppableCollectionState
} from '@react-stately/dnd';
import {DraggableCollectionProps, DragItem} from '@react-types/shared';
import {
  DraggableItemProps,
  DraggableItemResult,
  DragPreview,
  DropIndicatorAria,
  DropIndicatorProps,
  DroppableCollectionOptions,
  DroppableCollectionResult,
  DroppableItemOptions,
  DroppableItemResult,
  useDraggableItem,
  useDropIndicator,
  useDroppableCollection,
  useDroppableItem
} from '@react-aria/dnd';
import {DroppableCollectionProps} from '@react-types/shared';
import {Key, RefObject, useMemo} from 'react';

export interface DragHooks {
  useDraggableCollectionState(props: Omit<DraggableCollectionOptions, 'getItems'>): DraggableCollectionState,
  useDraggableItem(props: DraggableItemProps, state: DraggableCollectionState): DraggableItemResult,
  DragPreview: typeof DragPreview
}

export interface DropHooks {
  useDroppableCollectionState(props: DroppableCollectionStateOptions): DroppableCollectionState,
  useDroppableCollection(props: DroppableCollectionOptions, state: DroppableCollectionState, ref: RefObject<HTMLElement>): DroppableCollectionResult,
  useDroppableItem(options: DroppableItemOptions, state: DroppableCollectionState, ref: RefObject<HTMLElement>): DroppableItemResult,
  useDropIndicator(props: DropIndicatorProps, state: DroppableCollectionState, ref: RefObject<HTMLElement>): DropIndicatorAria
}

export interface DnDHooks {
  dragHooks: DragHooks,
  dropHooks: DropHooks
}

export interface DnDOptions extends Omit<DraggableCollectionProps, 'preview' | 'getItems'>, DroppableCollectionProps {
  /**
   * A function that returns the items being dragged. If not specified, assumes that the collection is not draggable.
   * @default () => []
   */
  getItems?: (keys: Set<Key>) => DragItem[]
  // Tentative prop. Handles converting the items from the drop operation's dataTransfer to the actual data format that the user can use
  // itemProcessor?: (data: any) => any
}

export function useDnDHooks(options: DnDOptions): DnDHooks {
  let dragHooks = useMemo(() => ({
    useDraggableCollectionState(props: DraggableCollectionOptions) {
      return useDraggableCollectionState({
        getItems: () => [],
        ...props,
        ...options
      });
    },
    useDraggableItem,
    DragPreview
  }), [options]);

  let dropHooks = useMemo(() => ({
    useDroppableCollectionState(props) {
      return useDroppableCollectionState({...props, ...options});
    },
    useDroppableItem,
    useDroppableCollection(props, state, ref) {
      return useDroppableCollection({...props, ...options}, state, ref);
    },
    useDropIndicator
  }), [options]);


  // If the user doesn't want their collection to be draggable/droppable, they can just not pass dragHooks/dropHooks to their collection
  return {
    dragHooks,
    dropHooks
  };
}