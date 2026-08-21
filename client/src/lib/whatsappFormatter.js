export const generateWhatsAppUrl = (chassis, modules, totals) => {
  const phone = "+213000000000"; // Placeholder Kouini Caravane number
  
  let message = `Salam Kouini Caravane! I designed a custom layout on your website studio:\n\n`;
  message += `• Chassis: ${chassis}\n`;
  message += `• Modules Placed:\n`;
  
  if (modules.length === 0) {
    message += `  - (None)\n`;
  } else {
    // Group identical modules
    const counts = {};
    modules.forEach(m => {
      counts[m.name] = (counts[m.name] || 0) + 1;
    });
    
    Object.keys(counts).forEach(key => {
      message += `  - ${counts[key]}x ${key}\n`;
    });
  }

  message += `\n• Est. Solar Power: ${totals.solar}W | Est. Water: ${totals.water}L | Est. Payload: ${totals.weight}kg`;

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encodedMessage}`;
};
