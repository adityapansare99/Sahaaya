// FlowRibbon — the signature donor -> NGO -> rider -> people pipeline.
// Presentational only. Decorative (aria-hidden).
import { Utensils, Heart, Bike, Users } from "lucide-react";

const FlowRibbon = ({ className = "" }) => {
  const node = (cls, Icon, label) => (
    <div className={"fr-node " + cls}>
      <div className="fr-ic"><Icon /></div>
      <div className="fr-lbl">{label}</div>
    </div>
  );
  const track = (cls) => (
    <div className={"fr-track " + cls}>
      <div className="fr-fill" />
      <div className="fr-dot" />
      <div className="fr-dot b" />
    </div>
  );
  return (
    <div className={"flow-ribbon " + className} aria-hidden="true">
      {node("n-donor", Utensils, "Donors")}
      {track("t-ngo")}
      {node("n-ngo", Heart, "NGOs")}
      {track("t-rider")}
      {node("n-rider", Bike, "Riders")}
      {track("t-people")}
      {node("n-people", Users, "People fed")}
    </div>
  );
};

export default FlowRibbon;
