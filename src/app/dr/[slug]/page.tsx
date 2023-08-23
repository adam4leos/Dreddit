'use client'
import { SubDredditFeed } from "@/components/SubDredditFeed/SubDredditFeed";
import { NewPostButton } from "@/components/NewPostButton/NewPostButton";

import './SubDreddit.scss';

const SubDredditPage = ({ params }: { params: { slug: string }}) => {
  const { slug } = params;

  return (
    <div className="SubDreddit">
      <h3 className="SubDreddit__header"><span className="SubDreddit__icon">{slug.slice(0, 1)}</span> dr/{slug}</h3>
      <NewPostButton />
      <SubDredditFeed subdredditSlug={slug} />
    </div>
  );
}

export default SubDredditPage;
