const Avatar = ({ width, height, imgUrl }) => {
  return (
    <div className="avatar-container" style={{ width, height }}>
      <img className="avatar" src={imgUrl} alt="avatar" />
    </div>
  );
};

export default Avatar;
