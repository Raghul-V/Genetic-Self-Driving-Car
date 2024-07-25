function getIntersection(A, B, C, D) {
    /*

    A = (Ax, Ay), B = (Bx, By), C = (Cx, Cy), D = (Dx, Dy)
    AB = (Bx-Ax, By-Ay)
    CD = (Dx-Cx, Dy-Cy)
    Points on line segment: A + tAB, 0 <= t <= 1
    Points on line segment: C + uCD, 0 <= u <= 1
    Intersection: A + tAB = C + uCD
    (Ax + t(Bx-Ax), Ay + t(By-Ay)) = (Cx + u(Dx-Cx), Cy + u(Dy-Cy))
    => Ax + t(Bx-Ax) = Cx + u(Dx-Cx) && Ay + t(By-Ay) = Cy + u(Dy-Cy)
    => t(Bx-Ax) = (Cx-Ax) + u(Dx-Cx) && t(By-Ay) = (Cy-Ay) + u(Dy-Cy)
    => t(Bx-Ax)(By-Ay) = (Cx-Ax)(By-Ay) + u(Dx-Cx)(By-Ay)
    => (Bx-Ax)((Cy-Ay) + u(Dy-Cy)) = (Cx-Ax)(By-Ay) + u(Dx-Cx)(By-Ay)
    => (Bx-Ax)(Cy-Ay) + u(Bx-Ax)(Dy-Cy) = (Cx-Ax)(By-Ay) + u(Dx-Cx)(By-Ay)
    => u(Bx-Ax)(Dy-Cy) - u(Dx-Cx)(By-Ay) = (Cx-Ax)(By-Ay) - (Bx-Ax)(Cy-Ay)

    => u = (Cx-Ax)(By-Ay)-(Bx-Ax)(Cy-Ay) / (Bx-Ax)(Dy-Cy)-(Dx-Cx)(By-Ay)
    => t = (Dx-Cx)(Ay-Cy)-(Dy-Cy)(Ax-Cx) / (Bx-Ax)(Dy-Cy)-(Dx-Cx)(By-Ay)

    */

    const tTop = (D.x-C.x)*(A.y-C.y) - (D.y-C.y)*(A.x-C.x)
    const uTop = (C.y-A.y)*(A.x-B.x) - (C.x-A.x)*(A.y-B.y)
    const bottom = (D.y-C.y)*(B.x-A.x) - (D.x-C.x)*(B.y-A.y)

    if (bottom != 0) {
        const t = tTop/bottom
        const u = uTop/bottom
        if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x: A.x+(B.x-A.x)*t,
                y: A.y+(B.y-A.y)*t,
                offset: t,
            }
        }
    }

    return null
}


function polysIntersect(poly1, poly2) {
    for (let i=0; i<poly1.length; i++) {
        for (let j=0; j<poly2.length; j++) {
            if (
                getIntersection(
                    poly1[i], 
                    poly1[(i+1) % poly1.length], 
                    poly2[j], 
                    poly2[(j+1) % poly2.length])
                ) {
                return true
            }
        }
    }
    return false
}


function getRGBA(value){
    const alpha = Math.abs(value);
    const R = value<0?0:255;
    const G = R;
    const B = value>0?0:255;
    return "rgba(" + R + "," + G + "," + B + "," + alpha + ")";
}



