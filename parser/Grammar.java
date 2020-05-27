package parser;

import java.util.LinkedList;

public class Grammar {
  protected LinkedList<Production> productions;
  public Grammar(String g){
    LinkedList<Production> productions = new LinkedList<>();
    String[] lines = g.split("\n");
    for (String line : lines) {
      String[] lineSplit = line.split("->");
      String left = lineSplit[0].trim();
      String right = lineSplit[1].trim();
      String[] prods = right.split("\\|");
      for (String prod : prods) {
        String[] prodSplit = prod.split(" ");
        Symbol[] tempRight = new Symbol[prodSplit.length];
        for (int i =0; i< prodSplit.length;i++){
          String prodSymbol = prodSplit[i];
          if(prodSymbol.toLowerCase().equals(prodSymbol)){
            tempRight[i] = new Terminal(prodSymbol);
          }
          else{
            tempRight[i] = new NonTerminal(prodSymbol);
          }
        }
        productions.add(new Production(new NonTerminal(left), tempRight));
      }
    }
  }

  @Override
  public String toString() {
    StringBuilder ret = new StringBuilder();
    for (Production p : productions) {
        ret.append(p.toString()+"\n");
    }
    return ret.toString();
  }
}