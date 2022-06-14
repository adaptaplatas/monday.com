import React from "react"
import ContentLoader from "react-content-loader";

const CardLoader = () => (
    <div className="card-component">
      <ContentLoader
          speed={2}
          width={300}
          height={50}
          viewBox="0 0 300 50"
          backgroundColor="#f3f3f3"
          foregroundColor="#ecebeb">
        <rect x="13" y="13" rx="0" ry="0" width="184" height="11" />
        <circle cx="268" cy="27" r="24" />
        <rect x="13" y="30" rx="0" ry="0" width="184" height="11" />
        <rect x="202" y="14" rx="0" ry="0" width="37" height="27" />
      </ContentLoader>
    </div>
)

export default CardLoader

