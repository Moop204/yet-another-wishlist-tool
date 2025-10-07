import {CSS} from '@dnd-kit/utilities';
import { useDraggable, useDroppable } from "@dnd-kit/core";


export const Droppable = (props: {id: string, children: React.ReactNode}) => {
  const {id} = props;
  const {isOver, setNodeRef} = useDroppable({
    id: id,
  });
  const style = {
    color: isOver ? 'green' : undefined,
  };
  
  
  return (
    <div ref={setNodeRef} style={style}>
      {props.children}
    </div>
  );
}

export const DraggableItem = (props: {position: number, children: React.ReactNode}) => {
  const {position} = props;
  const {attributes, listeners, setNodeRef, transform} = useDraggable({
    id: `${position}-position`,
    data: {position: position},
  });
  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <button ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {props.children}
    </button>
  );
}
