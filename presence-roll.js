/* The same shared roll rules as Studio's Presence preview. */
'use strict';
const PresenceRoll=(()=>{
 function select(moves,dice,round,nextEligible){
  if(!Number.isInteger(dice)||dice<1||dice>100||!Number.isInteger(round)||round<1)
   throw Error('Presence roll / round must be positive 1–100 and 1+ integers');
  const candidates=moves.filter(m=>dice<=m.chance).sort((a,b)=>a.chance-b.chance);
  const picked=candidates.find(m=>round>=(nextEligible[m.asset_no]||0))||null;
  if(picked)nextEligible[picked.asset_no]=round+picked.cooldown+1;
  return {picked,matched:candidates.length};
 }
 return Object.freeze({select});
})();
if(typeof module==='object'&&module.exports)module.exports=PresenceRoll;
