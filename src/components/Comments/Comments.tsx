import React from 'react';
import { formatNumber } from '@/utils/formatNumber';

import './Comments.scss';

interface ICommentsProps {
}

export const Comments = React.forwardRef<HTMLDivElement, ICommentsProps>((props, ref) => {
  return (
    <div className='Comments' ref={ref}>
      <div className='Comments__head'>
        <span className='Comments__sort-by'>Sort by: TODO SORTING</span>
        <hr className='Comments__head-separator'></hr>
        <span className='Comments__head-count'>{formatNumber(0)} comments</span>
      </div>
      <button className='Comments__add-btn'>Add a Comment</button>
      <div className='Comments__body'>
        TODO COMMENTS HERE
      </div>
    </div>
  );
});
