package parser;

public class LRGrammar extends Grammar{
  public LRGrammar(String g){
    super(g);
    for (Production p : this.productions) {
      p.getRight();
    }
  }
}