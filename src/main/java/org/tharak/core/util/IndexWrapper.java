package org.tharak.core.util;

import lombok.AllArgsConstructor;
import lombok.Getter;
@AllArgsConstructor
public class IndexWrapper {
	 @Getter
    private int start;
	 @Getter
    private int end;
 
    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + end;
        result = prime * result + start;
        return result;
    }
 
    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        IndexWrapper other = (IndexWrapper) obj;
        if (end != other.end)
            return false;
        if (start != other.start)
            return false;
        return true;
    }
 
}
