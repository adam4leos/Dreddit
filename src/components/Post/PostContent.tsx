import { useContext } from "react";

import { EPostTypes } from "@/contexts/PostsContext";
import { Web5StorageContext } from "@/contexts/Web5StorageContext";

export const PostContent = ({contentType, content}) => {
  const getPostContent = () => {
    console.log({contentType, content});
    switch (contentType) {
        case EPostTypes.POST: {
            return content;
        }

        case EPostTypes.MEDIA: {
          const [type] = content.type.split('/');
          const mediaUrl = URL.createObjectURL(content);
          
          return type === 'image' 
            ? <img src={mediaUrl} className="Post__media" />
            : <video controls src={mediaUrl} className="Post__media" />
        }

        default: {
            throw new Error(`Unknow content type: ${contentType}`);
        }
    }
};

  return (
    <div className="Post__content">
      {getPostContent()}
    </div>
  )
}