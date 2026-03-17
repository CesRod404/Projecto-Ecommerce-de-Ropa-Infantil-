export default function Card({ title, description, category, image }) {
  return (
    <div
      className={`card card--${category}`}
      style={{
        backgroundImage: `url(${image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="card__overlay">
        {category && <p className="card__category">{category}</p>}
        <h3 className="card__title">{title}</h3>
        {description && <p className="card__description">{description}</p>}
      </div>
    </div>
  );
}