package org.tharak.core.util;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import lombok.Getter;
 
public class WholeWordIndexFinder {
	@Getter
    private String searchString;
 
    public WholeWordIndexFinder(String searchString) {
        this.searchString = searchString;
    }
    public List<IndexWrapper> findIndexesForKeyword(String keyword) {
    	return findIndexesForKeyword(keyword, false);
    }
    public List<IndexWrapper> findIndexesForKeyword(String keyword, boolean isMasked) {
        String regex = "\\"+keyword+"\\b";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(searchString);
        List<IndexWrapper> wrappers = new ArrayList<IndexWrapper>();
        if(matcher.find()){
        	if(isMasked)
        		searchString = matcher.replaceFirst("?");
        	else {
            int end = matcher.end();
            int start = matcher.start();
            IndexWrapper wrapper = new IndexWrapper(start, end);
            wrappers.add(wrapper);
        	}
        }
        return wrappers;
    }
 
    public static void main(String[] args) {
        WholeWordIndexFinder finder = new WholeWordIndexFinder("Test :pPWDEXPIRY :pPWD :pPWD");
        List<IndexWrapper> indexes = finder.findIndexesForKeyword(":pPWD");
        System.out.println("Indexes found "+indexes.size() +" keyword found at index : "+indexes.get(0).getStart());
    }
 
}
