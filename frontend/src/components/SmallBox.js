function SmallBox({ title, value, className }) {
  return (
    <div className="col-md-3">
      <div className={`card text-white shadow-sm ${className}`}>
        <div className="card-body">
          <h3 className="fw-bold">{value}</h3>
          <p className="mb-0">{title}</p>
        </div>
      </div>
    </div>
  );
}

export default SmallBox;

