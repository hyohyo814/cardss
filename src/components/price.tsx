export default function CheckDiscount({priceStr}: {priceStr: string}) {
  if (/\s/.test(priceStr)) {
    const wsIndex = priceStr.indexOf(" ");
    const deprecatedPrice = priceStr.substring(0, wsIndex);
    const newPrice = priceStr.substring(wsIndex); 
    return (
      <>
        <span className="line-through text-red-500">{deprecatedPrice}</span>
        <span className="text-green-500">{newPrice}</span>
      </>
    );
  }

  return <span>{priceStr}</span>;
}

