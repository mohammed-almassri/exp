package parser;

public class Production {
  private NonTerminal left;
  private Symbol[] right;

  Production(NonTerminal left, Symbol... right){
    this.left = left;
    this.right = right;
  }

  /**
   * @return the left
   */
  public NonTerminal getLeft() {
    return left;
  }

  /**
   * @return the right
   */
  public Symbol[] getRight() {
    return right;
  }

  @Override
  public String toString() {
    StringBuilder ret = new StringBuilder();
    ret.append(left.toString());
    ret.append("->");
    for (Symbol r : right) {
        ret.append(r.toString());
    }
    return ret.toString();
  }

}